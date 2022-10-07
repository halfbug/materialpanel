import { gql } from '@apollo/client';

const ALL_STORES = gql`
query stores{
    stores {
    id
    brandName 
    createdAt       
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

export { ALL_STORES, ALL_STORES1 };
