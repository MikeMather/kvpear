

export const doRedirect = (path: string) => {
  return {
    redirect: {
      destination: path,
      permanent: false,
    },
  }
};
