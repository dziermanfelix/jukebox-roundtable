import { useNavigation } from 'react-router-dom';

const SubmitButton = ({ display, submittingDisplay }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <button type='submit' disabled={isSubmitting}>
      {isSubmitting ? submittingDisplay : display}
    </button>
  );
};

export default SubmitButton;
