export const validate = (schema, obj) => {
  try {
    schema.validateSync(obj);
  } catch (err) {
    return err.message;
  }
};

export const isObjectEmpty = (obj) => {
  if (obj && Object.keys(obj).length > 0) {
    return false;
  } else {
    return true;
  }
};

export const isSafeText = (e) =>{
  if(!((e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122) ||
    e.charCode === 45 || e.charCode === 46)) {
    e.preventDefault();
  }
}

export const isNumber = (e) => {
  if (e.key === 'e' || e.target.value.length > 9) {
    e.preventDefault();
  }
}

export const validateS = (validationSchema, state, setError) => {
  try {
    validationSchema.validateSync(state, { abortEarly: false });
  } catch (e) {
    e.inner.forEach(err => {
      setError(prevState => {
        return { ...prevState, [err.params.path]: err.message };
      });
    });
    return e;
  }
};
