import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getCookie } from "cookies-next";

export async function requireAuth(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> {
  const session = getCookie("session", {
    req: context.req,
    res: context.res,
  });

  if (!session) {
    return {
      redirect: {
        destination: "/Login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
