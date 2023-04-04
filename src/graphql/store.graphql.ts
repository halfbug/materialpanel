import { gql } from '@apollo/client';

const ALL_STORES = gql`
query stores{
    stores {
    id
    brandName 
    createdAt
    shop
    planResetDate  
    status
    subscription{
      status
    }
    discoveryTool{
      status
      matchingBrandName{
        id
        brandName
      }
    }
    drops{
      isVideoEnabled,
      allProductsCollectionId,
      bestSellerCollectionId,
      latestCollectionId,
      rewards{
        baseline
        average
        maximum
      }
      status
    }     
  }
}
`;

const ALL_LOGS = gql`
query apploggers{
  apploggers{
    id
    context
    level
    stack
    message
    createdAt
  }
}
`;

const ALL_DROPS = gql`
query dropsGroupshops{
  dropsGroupshops{
    id
    status
    shortUrl
    obSettings{
      ownerUrl
    }
    customerDetail{
      fullName
      firstName
      lastName
    }
    discountCode{
      title
      priceRuleId
    }
    createdAt
  }
}
`;

const DROPS_PAGE = gql`
query getDrops($gridargs:GridArgs! ){
  getDrops(gridArgs:$gridargs){
     pageInfo {
          total
          count
          currentPage
          lastPage
          hasNextPage
          hasPreviousPage
        }
    result{
       
    id
    status
    shortUrl
    obSettings{
      ownerUrl
    }
    customerDetail{
      fullName
      firstName
      lastName
    }
    discountCode{
      title
    }
    createdAt
 
    }
  }
}
`;

const VIDEO_POST = gql`
mutation CreateVideo($createVideoInput: CreateVideoInput!) {
  createVideo(CreateVideoInput: $createVideoInput) {
      storeId
      name
      status
      orderId
  }
}
`;

const GET_ALL_VIDEOS = gql`
  query videos($storeId: String!) {
    videos(storeId: $storeId) {
    _id
    name
    type
    status
    storeId
    orderId
    createdAt
    updatedAt
  }
}
`;

const VIDEOS_UPDATE = gql`
  mutation updateVideo($updateVideoInput: UpdateVideoInput!) {
    updateVideo(UpdateVideoInput: $updateVideoInput) {
      storeId
      _id
      name
      type
      status
      orderId
      createdAt
      updatedAt
  }
}
`;

const VIDEOS_REMOVE = gql`
  mutation removeVideo($id: String!) {
    removeVideo(id: $id) {
      status
      storeId
      name,
      type
  }
}
`;

const DISCOVERYTOOLS_UPDATE = gql`
  mutation UpdateDiscoveryTools($updateDiscoveryTools: UpdateStoreInput!) {
    updateDiscoveryTools(UpdateDiscoveryTools: $updateDiscoveryTools) {
      id
      status
      discoveryTool{
        status
        matchingBrandName{
          id
          brandName
        }
      }
      createdAt
  }
}
`;

const DROPS_UPDATE = gql`
  mutation UpdateStore($updateStoreInput: UpdateStoreInput!) {
    updateStore(updateStoreInput: $updateStoreInput) {
      id
      drops{
        isVideoEnabled
        rewards{
          baseline
          average
          maximum
        }
        status
        lastSync
        codeUpdateStatus
      }
  }
}
`;

const GET_STORE_DETAILS = gql`
query store($id: String!) {
  store(id: $id) {
    id
    brandName 
    createdAt
    shop
    planResetDate  
    status
    subscription{
      status
    }
    discoveryTool{
      status
      matchingBrandName{
        id
        brandName
      }
    }
    drops{
      isVideoEnabled,
      collections{
        name
        shopifyId
      }
      rewards{
        baseline
        average
        maximum
      }
      klaviyo{
        publicKey
        privateKey
        listId
        subscriberListId
        signup1
        signup2
        signup3
        signup4
      }
      status
      lastSync
      codeUpdateStatus
      dropsCount
    }
  }
}
`;

const DEFAULT_DISCOUNT = gql`
query findDrops($type: String!) {
  findDrops(type: $type) {
    details{
      baseline
      average
      maximum
    }
  }
}
`;

const GET_UPDATE_CODES_STATUS = gql`
query getUpdateDiscountStatus($storeId: String!) {
  getUpdateDiscountStatus(storeId: $storeId) {
    lastSync
    codeUpdateStatus
    dropsCount
  }
}
`;

const FIND_KLAVIYO_LIST = gql`
query findKlaviyoList($storeId: String!, $privateKey: String!) {
  findKlaviyoList(storeId: $storeId, privateKey: $privateKey) {
    listId    
  }
}
`;

const DROPS_CATEGORY_UPDATE = gql`
  mutation updateDropsCategory($CreateDropsCategoryForFront: CreateDropsCategoryForFront!) {
    updateDropsCategory(CreateDropsCategoryForFront: $CreateDropsCategoryForFront) {
      categoryId
      storeId
      title
      parentId
      collections{
        name
        shopifyId
        type
      }
      sortOrder
      status
    }
  }
`;

const DROPS_CATEGORY_REMOVE = gql`
  mutation removeDropsCategory($id: [String!]!) {
    removeDropsCategory(id: $id) {
      title
    }
  }
`;

const GET_DROPS_CATEGORY = gql`
query findByStoreId($storeId: String!) {
  findByStoreId(storeId: $storeId) {
    categoryId
    storeId
    title
    parentId
    collections{
      name
      shopifyId
      type
    }
    sortOrder
    status    
  }
}
`;

export {
  ALL_STORES, ALL_LOGS, VIDEO_POST, GET_ALL_VIDEOS, VIDEOS_UPDATE, DISCOVERYTOOLS_UPDATE,
  DROPS_UPDATE, GET_STORE_DETAILS, DEFAULT_DISCOUNT, ALL_DROPS, DROPS_PAGE, GET_UPDATE_CODES_STATUS,
  FIND_KLAVIYO_LIST, VIDEOS_REMOVE, DROPS_CATEGORY_UPDATE, GET_DROPS_CATEGORY,
  DROPS_CATEGORY_REMOVE,
};