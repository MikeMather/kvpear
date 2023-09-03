type ConditionalStyles = { [className: string]: boolean };
type ClassName = string | ConditionalStyles;

// combine class names
export const ccn = (...classNames: ClassName[]): string => {
  const combinedClassNames: string[] = [];

  classNames.forEach((className) => {
    if (typeof className === 'string') {
      combinedClassNames.push(className);
    } else if (typeof className === 'object') {
      for (const key in className) {
        if (className.hasOwnProperty(key) && className[key]) {
          combinedClassNames.push(key);
        }
      }
    }
  });
  return combinedClassNames.join(' ');
};