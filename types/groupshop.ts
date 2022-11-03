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
    // name?: any[],
    // createdAt?: Date,
    // status?: string,
    // type?: string,
    // updatedAt?: Date,
    // _id?: string
}

export interface IStore {
    id?: string,
    brandName?: string,
    status?: string,
    createdAt: Date,
    planResetDate: Date,
    subscription: keyof {status: string},

}
