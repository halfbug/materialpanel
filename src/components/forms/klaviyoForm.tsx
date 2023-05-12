/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  useState, useEffect,
} from 'react';
import {
  Card,
  Button,
  TextField,
  IconButton,
  Dialog,
} from '@mui/material';
import { useFormik, FormikProps } from 'formik';
import { useLazyQuery } from '@apollo/client';
import { FIND_KLAVIYO_LIST } from '@/graphql/store.graphql';
import * as yup from 'yup';
import { DropsForm } from '@/types/groupshop';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Container from '@mui/material/Container';

export interface DropKlaviyoProps {
  storeData: any;
  handleForm: any;
  setSubscriberListId: any;
  setFieldValue?: any;
}
export default function DropKlaviyoForm({
  handleForm, storeData, setFieldValue, setSubscriberListId,
}: DropKlaviyoProps) {
  const [storeId, setStoreId] = useState('');
  const [sListId, setSListId] = useState('');
  const [showInst, setShowInst] = useState<boolean>(false);
  const [getDrop, { data: dropData }] = useLazyQuery(FIND_KLAVIYO_LIST, {
    onCompleted: (res) => {
      setSubscriberListId(res?.findKlaviyoList.listId);
      setSListId(res?.findKlaviyoList.listId);
    },
    onError() { console.log('Error in finding Droplist!'); },
  });

  useEffect(() => {
    if (sListId) {
      handleForm();
    }
  }, [sListId]);

  const updateKlaviyoForm = (values: any) => {
    setFieldValue('privateKey', values.privateKey);
    setFieldValue('publicKey', values.publicKey);
    setFieldValue('listId', values.listId);
    setFieldValue('signup1', values.signup1);
    setFieldValue('signup2', values.signup2);
    setFieldValue('signup3', values.signup3);
    setFieldValue('signup4', values.signup4);
    getDrop({ variables: { storeId, privateKey: values.privateKey } });
  };

  const [dropsIds, setDropsIds] = useState<any>({
    publicKey: '',
    privateKey: '',
    listId: '',
    subscriberListId: '',
    signup1: '',
    signup2: '',
    signup3: '',
    signup4: '',
  });

  useEffect(() => {
    setStoreId(storeData.id);
  }, [storeData]);

  useEffect(() => {
    if (storeData?.drops?.klaviyo) {
      setDropsIds({
        publicKey: storeData.drops?.klaviyo.publicKey,
        privateKey: storeData.drops?.klaviyo.privateKey,
        listId: storeData.drops?.klaviyo.listId,
        subscriberListId: storeData.drops?.klaviyo.subscriberListId,
        signup1: storeData.drops?.klaviyo.signup1,
        signup2: storeData.drops?.klaviyo.signup2,
        signup3: storeData.drops?.klaviyo.signup3,
        signup4: storeData.drops?.klaviyo.signup4,
      });
    }
  }, [storeData?.drops?.klaviyo]);

  const validationSchema = yup.object({
    publicKey: yup
      .string()
      .required('Klaviyo Public Key is required'),
    privateKey: yup
      .string()
      .required('Klaviyo Private Key is required'),
    listId: yup
      .string()
      .required('Drop List ID is required'),
    signup1: yup
      .string()
      .required('Klaviyo Signup 1 Form is required'),
    signup2: yup
      .string()
      .required('Klaviyo Signup 2 Form is required'),
    signup3: yup
      .string()
      .required('Klaviyo Signup 3 Form is required'),
    signup4: yup
      .string()
      .required('Klaviyo Signup 4 Form is required'),

  });

  const {
    handleSubmit, values, handleChange, touched, errors,
  }: FormikProps<DropsForm> = useFormik<DropsForm>({
    initialValues: dropsIds,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: async (value) => {
      try {
        updateKlaviyoForm(value);
      } catch (error) {
        console.error('An unexpected error happened:', error);
      }
    },
  });

  const json = {
    id: '{{ person.KlaviyoID }}',
    email: '{{ person.email }}',
    full_name: "{{ person|lookup:'Full Name'|default:'' }}",
    first_name: '{{ person.first_name }}',
    last_name: '{{ person.last_name }}',
    phone_number: '{{ person.phone_number }}',
  };

  return (
    <>
      <div>
        <h2 style={{ alignItems: 'center' }}>
          Klaviyo Integration
          {' '}
          <IconButton onClick={() => setShowInst(true)}><ErrorOutlineOutlinedIcon /></IconButton>
        </h2>
        <form noValidate onSubmit={handleSubmit}>
          <Card style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h4 className="lable" style={{ width: '135px' }}>Klaviyo Public Key</h4>
              <TextField
                id="publicKey"
                name="publicKey"
                placeholder="Please enter Klaviyo Public Key"
                value={values.publicKey}
                onChange={handleChange}
                error={touched.publicKey && Boolean(errors.publicKey)}
                helperText={touched.publicKey && errors.publicKey}
                style={{ width: '300px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h4 className="lable" style={{ width: '135px' }}>Klaviyo Private Key</h4>
              <TextField
                id="privateKey"
                name="privateKey"
                placeholder="Please enter Klaviyo Public Key"
                value={values.privateKey}
                onChange={handleChange}
                error={touched.privateKey && Boolean(errors.privateKey)}
                helperText={touched.privateKey && errors.privateKey}
                style={{ width: '300px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h4 className="lable" style={{ width: '135px' }}>Drop List ID</h4>
              <TextField
                id="listId"
                name="listId"
                placeholder="Please enter Drop List ID"
                value={values.listId}
                onChange={handleChange}
                error={touched.listId && Boolean(errors.listId)}
                helperText={touched.listId && errors.listId}
                style={{ width: '300px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h4 className="lable" style={{ width: '135px' }}>Signup Form 1</h4>
              <TextField
                id="signup1"
                name="signup1"
                placeholder="Please enter Signup Form 1 ID"
                value={values.signup1}
                onChange={handleChange}
                error={touched.signup1 && Boolean(errors.signup1)}
                helperText={touched.signup1 && errors.signup1}
                style={{ width: '300px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h4 className="lable" style={{ width: '135px' }}>Signup Form 2</h4>
              <TextField
                id="signup2"
                name="signup2"
                placeholder="Please enter Signup Form 2 ID"
                value={values.signup2}
                onChange={handleChange}
                error={touched.signup2 && Boolean(errors.signup2)}
                helperText={touched.signup2 && errors.signup2}
                style={{ width: '300px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h4 className="lable" style={{ width: '135px' }}>Signup Form 3</h4>
              <TextField
                id="signup3"
                name="signup3"
                placeholder="Please enter Signup Form 3 ID"
                value={values.signup3}
                onChange={handleChange}
                error={touched.signup3 && Boolean(errors.signup3)}
                helperText={touched.signup3 && errors.signup3}
                style={{ width: '300px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h4 className="lable" style={{ width: '135px' }}>Signup Form 4</h4>
              <TextField
                id="signup4"
                name="signup4"
                placeholder="Please enter Signup Form 4 ID"
                value={values.signup4}
                onChange={handleChange}
                error={touched.signup4 && Boolean(errors.signup4)}
                helperText={touched.signup4 && errors.signup4}
                style={{ width: '300px' }}
              />
            </div>
            <Button variant="contained" type="submit" style={{ marginTop: '10px' }}>Save</Button>
          </Card>
        </form>
      </div>
      <Dialog
        open={showInst}
        onClose={() => setShowInst(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container>
          <h2 style={{ textAlign: 'center' }}>Klaviyo Flow Setup Instruction</h2>
          <hr />
          <h4>
            Step 1
          </h4>
          <span>
            - Create flow on klaviyo
            <br />
            - Select Create From Scratch
          </span>
          <h4>
            Step 2
          </h4>
          <span>
            Select the FLOW TRIGGER (Your Drop List)
          </span>
          <h4>
            Step 3
          </h4>
          <span>
            Add Webhook
          </span>
          <h4>
            Step 4
          </h4>
          <span>
            <b>Add the destination URL</b>
            {' '}
            : https://api.groupshop.co/webhooks/klaviyo-drops?shop=
            {storeData?.shop}
          </span>
          <h4>
            Enter your payload information as a JSON block:
          </h4>
          <span>
            <pre>{JSON.stringify(json, null, 2)}</pre>
          </span>
        </Container>
      </Dialog>

    </>
  );
}
