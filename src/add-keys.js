export default (targetObj, fromObj) => {
  if (fromObj) {
    // Copy object reference to prevent assigning to function parameter.
    const referenceObjCopy = targetObj
    Object.keys(fromObj).forEach(key => {
      referenceObjCopy[key] = fromObj[key]
    })
  }
}
