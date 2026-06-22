import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Role } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export async function POST(req: Request){
    const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
    const body = await req.json();

  const { comment, rating } = body;

  const role = user.unsafeMetadata.role as Role;
  console.log({
  userId,
  role: user.unsafeMetadata.role,
  firstName: user.firstName,
  lastName: user.lastName,
  comment,
  rating,
});

   await prisma.siteComment.create({
        data: {
        clerkId: userId,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        role: role,
        comment:comment,
        rating:rating,
    },
   });
return Response.json({ success: true });
}