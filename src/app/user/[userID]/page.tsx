import { Metadata } from "next";
import UserContainer from "@/app/components/userContainer";
import UserAvatar from "@/app/components/userAvatar";
import UserLink from "@/app/components/userLinks";
import { prisma } from "../../../../backend/utils/prisma";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
interface PageProps {
  params: {
    userID: string;
  };
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: `${params.userID} linkit`,
  };
}
const page = async ({ params }: PageProps) => {
  try {
    const user: User = await prisma.user.create({
      data: {
        email: "example@example.com",
        name: "John Doe",
        links: {
          create: [
            {
              title: "Link 1",
              linkURL: "https://example.com/link1",
            },
          ],
        },
      },
    });

    console.log("User created:", user);
  } catch (error) {
    console.error("Error writing to database: " + error);
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error.message);
      console.error(error.meta);
    }
  }
  // this page receives the slug
  // fetch user data from db and create the link tree
  return (
    <>
      <UserContainer>
        <UserAvatar />
        {params.userID}
        <UserLink />
      </UserContainer>
    </>
  );
};
export default page;
