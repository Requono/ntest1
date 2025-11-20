import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getCookie } from "cookies-next";

export function requireAuth<P = {}>(
  getServerSideProps?: (
    context: GetServerSidePropsContext
  ) => Promise<GetServerSidePropsResult<P>>
) {
  return async (context: GetServerSidePropsContext) => {
    const session = getCookie("session", {
      req: context.req,
      res: context.res,
    });

    if (!session) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    if (getServerSideProps) {
      return await getServerSideProps(context);
    }

    return {
      props: {} as P,
    };
  };
}
