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
     roles?: string[]
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
     allProducts: string,
     latestProducts: string,
     bestSellers: string,
     spotlightProducts: string,
}
