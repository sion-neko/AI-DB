import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Folder, Conversation, AppData } from '../types';
import { loadData, saveData, generateId } from '../utils/storage';

interface DataContextType {
  folders: Folder[];
  conversations: Conversation[];
  isLoading: boolean;
  addFolder: (name: string) => Promise<Folder>;
  updateFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  addConversation: (folderId: string, question: string, answer: string, id?: string) => Promise<Conversation>;
  updateConversation: (id: string, question: string, answer: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  getConversationsByFolder: (folderId: string) => Conversation[];
  searchConversations: (query: string) => Conversation[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 続けて呼ばれても前の変更を取りこぼさないよう、最新の内容は ref に持つ
  const store = useRef<AppData>({ folders: [], conversations: [] });

  const apply = async (next: AppData) => {
    store.current = next;
    setFolders(next.folders);
    setConversations(next.conversations);
    await saveData(next);
  };

  useEffect(() => {
    loadData().then((data) => {
      store.current = data;
      setFolders(data.folders);
      setConversations(data.conversations);
      setIsLoading(false);
    });
  }, []);

  const addFolder = async (name: string): Promise<Folder> => {
    const newFolder: Folder = {
      id: generateId(),
      name,
      createdAt: Date.now(),
    };
    const { folders, conversations } = store.current;
    await apply({ folders: [...folders, newFolder], conversations });
    return newFolder;
  };

  const updateFolder = async (id: string, name: string): Promise<void> => {
    const { folders, conversations } = store.current;
    await apply({ folders: folders.map((f) => (f.id === id ? { ...f, name } : f)), conversations });
  };

  const deleteFolder = async (id: string): Promise<void> => {
    const { folders, conversations } = store.current;
    await apply({
      folders: folders.filter((f) => f.id !== id),
      conversations: conversations.filter((c) => c.folderId !== id),
    });
  };

  const addConversation = async (
    folderId: string,
    question: string,
    answer: string,
    id?: string
  ): Promise<Conversation> => {
    const now = Date.now();
    const newConversation: Conversation = {
      id: id ?? generateId(),
      folderId,
      question,
      answer,
      createdAt: now,
      updatedAt: now,
    };
    const { folders, conversations } = store.current;
    await apply({ folders, conversations: [...conversations, newConversation] });
    return newConversation;
  };

  const updateConversation = async (
    id: string,
    question: string,
    answer: string
  ): Promise<void> => {
    const { folders, conversations } = store.current;
    await apply({
      folders,
      conversations: conversations.map((c) =>
        c.id === id ? { ...c, question, answer, updatedAt: Date.now() } : c
      ),
    });
  };

  const deleteConversation = async (id: string): Promise<void> => {
    const { folders, conversations } = store.current;
    await apply({ folders, conversations: conversations.filter((c) => c.id !== id) });
  };

  const getConversationsByFolder = (folderId: string): Conversation[] => {
    return conversations
      .filter((c) => c.folderId === folderId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  };

  const searchConversations = (query: string): Conversation[] => {
    const lowerQuery = query.toLowerCase();
    return conversations
      .filter(
        (c) =>
          c.question.toLowerCase().includes(lowerQuery) ||
          c.answer.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => b.updatedAt - a.updatedAt);
  };

  return (
    <DataContext.Provider
      value={{
        folders,
        conversations,
        isLoading,
        addFolder,
        updateFolder,
        deleteFolder,
        addConversation,
        updateConversation,
        deleteConversation,
        getConversationsByFolder,
        searchConversations,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
