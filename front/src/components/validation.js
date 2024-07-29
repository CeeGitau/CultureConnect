export default function Validation(values) {
  let errors = {};

  // const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

  if (values?.name) {
    if (!values.name) {
      errors.name = "This field should not be empty";
      // } else if (values.name.length < 3 || values.name.length > 30) {
      //  errors.name = "Your name should be between 3-30 characters";
    } else {
      errors.name = "";
    }
  }
  if (!values.email) {
    errors.email = "Please enter a valid e-mail address";
    // } else if (!email_pattern.test(values.email)) {
    // errors.email = "Invalid E-mail Address!";
  } else {
    errors.email = "";
  }

  if (!values.password) {
    errors.password = "This field here should not be empty";
    // } else if (!password_pattern.test(values.password)) {
    //  errors.password =
    //    "Password should contain at least 8 characters (1 letter, 1 uppercase character and 1 number)";
  } else {
    errors.password = "";
  }

  return errors;
}
