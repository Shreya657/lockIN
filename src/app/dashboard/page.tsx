import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar } from "lucide-react";
import { prisma } from "../../../utils/prisma";
import { LogWorkForm } from "../components/loggedWork";
import { DeleteButton } from "../components/deleteLogBtn";
import { EditProofDialog } from "../components/editLog";


export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  const proofs = await prisma.proof.findMany({
    where: { userId: session?.user.id },
    orderBy: { createdAt: "desc" },
  });
  const today = new Date().toLocaleDateString();
  const todayProofs = proofs.filter(p => 
  new Date(p.createdAt).toLocaleDateString() === today
);


  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">GM, {session?.user.name}</h1>
        <p className="text-zinc-500">Time to add some proof to the pile.</p>
       
      </header>
     

   {/* inputs */}
      <LogWorkForm />

{/* todays tasks */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-zinc-500" />
          Recent Activity
        </h2>
        
        {todayProofs.length === 0 ? (
          <div className="border-2 border-dashed border-zinc-800 rounded-xl p-20 text-center text-zinc-600">
            No proof yet. Ship something today!
          </div>
        ) : (
         <div className="grid gap-4">
  {todayProofs.map((proof) => (
    <Card key={proof.id} className="group bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

        <div className="space-y-1">
          <CardTitle className="text-lg font-medium text-blue-500">{proof.title}</CardTitle>
          <Badge variant="secondary" className="bg-zinc-900 text-zinc-400 hover:bg-zinc-800">
            {proof.category}
          </Badge>
        </div>

        <div className="flex items-center gap-2"> 
          {proof.proofUrl && (
            <a 
              href={proof.proofUrl} 
              target="_blank" 
              className="hover:text-blue-500 transition-colors text-white p-1"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          <EditProofDialog proof={proof} />
          <DeleteButton id={proof.id} />
        </div>
      </CardHeader>

      {proof.description && (
        <CardContent>
          <p className="text-sm text-zinc-400 line-clamp-2">{proof.description}</p>
        </CardContent>
      )}
    </Card>
  ))}
</div>
        )}
      </div>
    </div>
  );
}