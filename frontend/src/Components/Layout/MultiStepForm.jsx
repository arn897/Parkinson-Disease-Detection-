import React, { useState } from 'react';
import Step from './Step';
import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setResult } from './../../redux/resultSlice';


import '../../Styles/layout.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const steps = [
  // Define your steps here
  { title: 'Step 1', fields: ['username', 'jitter_abs', 'jitter_ddp', 'jitter_local'] },
  { title: 'Step 2', fields: ['jitter_ppq5', 'jitter_rap', 'shimmer_apq3', 'shimmer_apq5'] },
  { title: 'Step 3', fields: ['shimmer_db', 'shimmer_dda', 'shimmer_local'] },
];

const MultiStepForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState();

  const dispatch = useDispatch();

  const navigate = useNavigate();


  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const isAnyFieldEmpty = () => {
    const currentStepFields = steps[step].fields;
    return currentStepFields.some((field) => !formData[field]);
  };

  const isAllFieldsEmpty = () => {
    return steps.some((step) => step.fields.some((field) => !formData[field]));
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const onSubmitForm = async () => {

    try {

      setLoading(true);

      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_FASTAPI_URL}`, {
        "jitter_abs": Number(formData.jitter_abs),
        "jitter_ddp": Number(formData.jitter_ddp),
        "jitter_local": Number(formData.jitter_local),
        "jitter_ppq5": Number(formData.jitter_ppq5),
        "jitter_rap": Number(formData.jitter_rap),
        "shimmer_apq3": Number(formData.shimmer_apq3),
        "shimmer_apq5": Number(formData.shimmer_apq5),
        "shimmer_db": Number(formData.shimmer_db),
        "shimmer_dda": Number(formData.shimmer_dda),
        "shimmer_local": Number(formData.shimmer_local)
      });

      setLoading(false);

      if (data.pred_value === 0) {

        toast.success('Prediction done successfully', {
          position: 'bottom-center',
          duration: 3500
        });

        dispatch(setResult(`Dear ${formData.username}, you don't have Parkinson Disease.`));

        navigate('/result');

      } else {

        toast.success('Prediction done successfully', {
          position: 'bottom-center',
          duration: 3500
        });

        dispatch(setResult(`Dear ${formData.username}, you have Parkinson Disease.`));

        navigate('/result');

      }

    } catch (error) {

      setLoading(false);

      toast.error('Something went wrong!! Please try again', {
        position: 'bottom-center',
        duration: 3500
      });

      console.log(error);

    }
  }

  return (
    <div>
      <Step
        title={steps[step].title}
        fields={steps[step].fields}
        formData={formData}
        onInputChange={handleInputChange}
      />
      <div className="arrow-container">
        <button onClick={prevStep} disabled={step === 0} className={step === 0 ? 'disabled-button' : ''}>
          <BsFillArrowLeftCircleFill className="arrow" />
        </button>
        {step === steps.length - 1 ? (
          <button className={isAllFieldsEmpty() ? 'disabled-button' : 'btn'} type='button' disabled={isAllFieldsEmpty()} onClick={onSubmitForm}>
            {loading ? 'Predicting' : 'Predict'}
          </button>
        ) : (
          <button
            className={isAnyFieldEmpty() ? 'disabled-button' : ''}
            onClick={nextStep}
            disabled={isAnyFieldEmpty() || loading ? true : false}
          >
            <BsFillArrowRightCircleFill className="arrow" />
          </button>
        )}
      </div>
    </div>
  );
}

export default MultiStepForm;
