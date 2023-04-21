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
    matchingBrandNameEvent?: string,
    collectionIdsData?: any,
    editId?: any,
    removeId?: any,
    removeUserData?: any,
}

export interface DiscoveryTools {
    status?: string,
    selectBrandName?: string[],
    discoveryTool?: object,
}
export interface IUser {
    first_name: string;
     last_name: string;
     email: string;
     id:string;
     name?: string;
     userRole?: string;
     avatar?: string,
     jobtitle?: string,
    }
export interface DropsForm {
     M1Discount: string,
     M2Discount: string,
     M3Discount: string,
     spotlightDiscountTitle : string,
     spotlightDiscountPercentage : string,
     spotlightDiscountPriceRuleId : string,
     vaultDiscountTitle : string,
     vaultDiscountPercentage : string,
     vaultDiscountPriceRuleId : string,
     allProducts: string,
     latestProducts: string,
     bestSellers: string,
     vaultProducts: string,
     spotlightProducts: string,
     collections: Collections[],
     publicKey: string,
     privateKey: string,
     listId: string,
     subscriberListId: string,
     signup1: string,
     signup2: string,
     signup3: string,
     signup4: string,
}
export interface Collections {
    name: string,
    shopifyId: string,
}

export interface CollectionIdForm {
    name: string,
    type: string,
    shopifyId: string,
}

export interface AdminUserUpdate {
    id?: string,
    firstName: string,
    lastName: string,
    email: string,
    status : string,
    userRole : string,
}
export interface AdminUser {
    id?: string,
    firstName: string,
    lastName: string,
    password: string,
    cpassword: string,
    email: string,
    status : string,
    userRole : string,
}

export interface Permissions {
    name?: string,
    category?: string,
}

export interface AdminUserRoles {
    roleName?: string,
    permission?: Permissions[],
}

export interface AdminUserRolesUpdate {
    id?: string,
    roleName: string,
    permission?: Permissions[],

}
export interface CartRewards {
    rewardTitle: string,
    rewardValue: string,
}
