import { gql } from '@apollo/client';

const ALL_STORES = gql`
query stores{
    stores {
    id
    brandName 
    createdAt
    planResetDate       
  }
}
`;

const ALL_STORES1 = gql`
query stores{
    stores {
    id
    brandName        
  }
}
`;

const VIDEO_POST = gql`
mutation CreateVideo($createVideoInput: CreateVideoInput!) {
  createVideo(CreateVideoInput: $createVideoInput) {
      storeId
      name
      status
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
    createdAt
    updatedAt
  }
}
`;

export {
  ALL_STORES, ALL_STORES1, VIDEO_POST, GET_ALL_VIDEOS,
};
