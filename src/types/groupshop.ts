export interface VideoStore {
    storeId?: string,
    name?: any[],
    status?: string,
    createVideo?: any[],
}
export interface VideoUpdate {
    storeId?: string,
    name?: string,
    status?: string,
    data?: string[],
    updateVideo?: any[],
}

export interface IStore {
    id?: string,
    brandName?: string,
    status?: string,
    createdAt: Date,
    planResetDate: Date,
    subscription: keyof {status: string},

}
export interface MStore {
    brandName?: string,
}

export interface IUser {
    first_name: string;
     last_name: string;
     email: string;
     id:string;
     name?: string;
     roles?: string[]
     avatar?: string,
     jobtitle?: string,
    }
