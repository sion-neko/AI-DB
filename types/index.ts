export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  folderId: string;
  question: string;
  answer: string;
  createdAt: number;
  updatedAt: number;
}

export interface AppData {
  folders: Folder[];
  conversations: Conversation[];
}
