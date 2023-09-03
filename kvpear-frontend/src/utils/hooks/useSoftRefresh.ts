import { useRouter } from "next/router";


export default function useSoftRefresh() {
  const router = useRouter();

  const softRefresh = () => {
    router.replace(router.asPath);
  }
  return softRefresh;
}