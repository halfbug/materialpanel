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
query apploggers($gridargs:GridArgs! ){
  apploggers(gridArgs:$gridargs){
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
      context
      level
      stack
      message
      createdAt
    }
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
    store{
      shop
    }
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
    collectionsToUpdate {
      collectionTitle
      collectionId
      isSynced
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
      cartRewards{
        id
        rewardTitle
        rewardValue
      }
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
  mutation removeDropsCategory($id: [String!]!, $collectionUpdateMsg: String!, $userId: String!, $storeId: String!) {
    removeDropsCategory(id: $id, collectionUpdateMsg: $collectionUpdateMsg, userId: $userId, storeId: $storeId) {
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
      mergedIds
      isAutoGeneratedBy
      isVisible
    }
    sortOrder
    status    
  }
}
`;

const ALL_USERS = gql`
query getAdminUsers{
  getAdminUsers{
    id
    firstName
    lastName
    email
    status
    userRole{
      id
      roleName
    }    
    createdAt
    lastLogin
    favouriteStore
  }
}
`;

const ALL_ADMIN_USERS_ROLES = gql`
query getAdminRoles{
  getAdminRoles{
    id
    roleName
    permission{
      name
      category
    }
    createdAt
  }
}
`;

const GET_USER = gql`
query getAdminUser($id: String!) {
  getAdminUser(id: $id) {
    id
    firstName
    lastName
    email
    status    
    createdAt
  }
}
`;

const UPDATE_ADMIN_USER = gql`
  mutation updateAdminUser($updateAdminUserInput: UpdateAdminUserInput!) {
    updateAdminUser(updateAdminUserInput: $updateAdminUserInput) {      
      id
      firstName
      lastName
      status
      email 
      userRole{
        id
        roleName
      }    
      createdAt
      lastLogin
      favouriteStore
  }
}
`;

const CREATE_ADMIN_USER = gql`
mutation createAdminUser($createAdminUserInput: CreateAdminUserInput!) {
  createAdminUser(createAdminUserInput: $createAdminUserInput) {
    firstName
    lastName   
    email 
    password
    status
  }
}
`;

const CREATE_ADMIN_USER_ROLE = gql`
mutation createAdminRole($createAdminRoleInput: CreateAdminRoleInput!) {
  createAdminRole(createAdminRoleInput: $createAdminRoleInput) {
    roleName
    permission{
      name
      category
    }
  }
}
`;

const UPDATE_ADMIN_USER_ROLE = gql`
  mutation updateAdminRole($updateAdminRoleInput: UpdateAdminRoleInput!) {
    updateAdminRole(updateAdminRoleInput: $updateAdminRoleInput) {      
      id
      roleName
      permission{
        name
        category
      }
  }
}
`;

const FIND_ADMIN_ROLE_BY_NAME = gql`
query findUserPermissions($userRole: String!) {
  findUserPermissions(userRole: $userRole) {
    roleName
      permission{
        name
        category
      }
      generalPermission{
        title
        route
        category
      }     
  }
}
`;

const FIND_ADMIN_PERMISSION = gql`
query getAdminPermissions{
  getAdminPermissions{
    title
    route
    category
  }
}
`;

const SYNC_DISCOUNT_CODES = gql`
mutation syncDiscountCodes($storeId: String!, $userId: String!) {
  syncDiscountCodes(storeId: $storeId, userId: $userId) {
    codeUpdateStatus
  }
}
`;

const FIND_LATEST_LOG = gql`
query findLatestLog($storeId: String!, $context: String!){
  findLatestLog(storeId: $storeId, context: $context){
    message
    createdAt
  }
}
`;

const REMOVE_USER = gql`
  mutation removeAdminUser($userId: String!, $id: String!) {
    removeAdminUser(userId: $userId, id: $id) {      
      status
  }
}
`;

const REMOVE_ROLE = gql`
  mutation removeAdminRole($userId: String!, $id: String!) {
    removeAdminRole(userId: $userId, id: $id) {
      roleName
  }
}
`;

const GET_INVENTORY_BY_ID = gql`
query findById($id: String!) {
  findById(id: $id) {
    id
    title
  }
}
`;

const DROPS_ACTIVITY = gql`
query dropsActivity($route: String!, $storeId: String!, $filter: String!) {
  dropsActivity(route: $route, storeId: $storeId, filter: $filter) {
    id
    context
    operation
    user{
      firstName
      lastName
      email
    }
    changes{
      id
      parentTitle
      fieldname
      oldvalue
      newValue
      title
      parentId
      sortOrder
      status      
      rewardTitle      
      rewardValue
      name
      type
      orderId
      brandName
      discoveryTool{
        id
        brandName
      }
      collections{
        name
        shopifyId
        type
      }
    }
    createdAt  
  }
}
`;

const CLEAR_LOG_BY_LEVEL = gql`
  mutation removeAppLoggerByLevel($level: String!) {
    removeAppLoggerByLevel(level: $level) {
      message
  }
}
`;

const SYNC_COLLECTIONS = gql`
  query syncCollection($storeId: String!) {
    syncCollection(storeId: $storeId) {
      status
  }
}
`;

const GET_UPDATE_COLLECTION_STATUS = gql`
query getUpdateCollectionStatus($storeId: String!) {
  getUpdateCollectionStatus(storeId: $storeId) {
    collectionUpdateStatus
  }
}
`;

const ADMIN_ACTIVITY = gql`
query adminActivity($route: String!, $filter: String!) {
  adminActivity(route: $route, filter: $filter) {
    id
    context
    operation
    user{
      firstName
      lastName
      email
    }
    adminRole{
      roleName
    }
    changes{
      id
      parentTitle
      fieldname
      oldvalue
      newValue
      firstName
      lastName
      email
      userRole
      roleName
      permission{
        name
      }
    }
    createdAt  
  }
}
`;

const GET_COLLECTION_LIST = gql`
query getCollectionList($shop: String!) {
  getCollectionList(shop: $shop) {
    collections {
      collectionTitle
      collectionId
      isSynced
      productCount
    }
    collectionsToUpdate {
      collectionTitle
      collectionId
      isSynced
    }
  }
}
`;

const GET_APP_LOGGER_DATA_VIA_CONTEXT = gql`
query getAppLoggerData($context: [String!]!) {
  getAppLoggerData(context: $context) {
    lastAutoSync {
      createdAt
      context
    }
  }
}
`;
const GET_DISCOUNT_LOGGER_DATA_VIA_CONTEXT = gql`
query getDiscountLoggerData($context: String!) {
  getDiscountLoggerData(context: $context) {
    id
    message
    context
    createdAt
  }
}
`;
const GET_SYNC_BTN_DATE_VIA_CONTEXT = gql`
query getDiscountLoggerData($context: String!) {
  getDiscountLoggerData(context: $context) {
    id
    message
    context
    createdAt
  }
}
`;

const GET_DROP_BANNER = gql`
query getDropBanner{
  getDropBanner{
    id
    settings{
      dropBanner     
      layout{   
        bannerSummaryPage
      }      
    }
  }
}
`;

const UPDATE_DROPS_BANNER = gql`
  mutation UpdateStore($updateStoreInput: UpdateStoreInput!) {
    updateStore(updateStoreInput: $updateStoreInput) {
      id
      settings{
        dropBanner
        layout{   
          bannerSummaryPage
        }         
      }
  }
}
`;

const REMOVE_DROP_BANNER = gql`
  mutation removeDropBanner($file: String!) {
    removeDropBanner(file: $file) {
      status    
  }
}
`;

export {
  ALL_STORES, ALL_LOGS, VIDEO_POST, GET_ALL_VIDEOS, VIDEOS_UPDATE, DISCOVERYTOOLS_UPDATE,
  DROPS_UPDATE, GET_STORE_DETAILS, DEFAULT_DISCOUNT, ALL_DROPS, DROPS_PAGE, GET_UPDATE_CODES_STATUS,
  FIND_KLAVIYO_LIST, VIDEOS_REMOVE, DROPS_CATEGORY_UPDATE, GET_DROPS_CATEGORY,
  DROPS_CATEGORY_REMOVE, ALL_USERS, GET_USER, UPDATE_ADMIN_USER, CREATE_ADMIN_USER,
  CREATE_ADMIN_USER_ROLE, ALL_ADMIN_USERS_ROLES, UPDATE_ADMIN_USER_ROLE, FIND_ADMIN_ROLE_BY_NAME,
  FIND_ADMIN_PERMISSION, SYNC_DISCOUNT_CODES, FIND_LATEST_LOG, REMOVE_USER, REMOVE_ROLE,
  GET_INVENTORY_BY_ID, DROPS_ACTIVITY, CLEAR_LOG_BY_LEVEL, SYNC_COLLECTIONS,
  GET_UPDATE_COLLECTION_STATUS, ADMIN_ACTIVITY, GET_COLLECTION_LIST,
  GET_APP_LOGGER_DATA_VIA_CONTEXT, GET_DISCOUNT_LOGGER_DATA_VIA_CONTEXT,
  GET_SYNC_BTN_DATE_VIA_CONTEXT, GET_DROP_BANNER, UPDATE_DROPS_BANNER, REMOVE_DROP_BANNER,
};
