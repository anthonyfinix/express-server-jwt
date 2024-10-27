export interface IUser {
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserModel extends IUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
  }
  
  export interface JwtPayload {
    userId: string;
    email: string;
  }