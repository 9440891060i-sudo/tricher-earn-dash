import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
// import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Users, Star, Medal } from "lucide-react";

// Mock data removed — leaderboard now uses API-provided `list` only

type SortKey = "revenue" | "sales";

export default function Leaderboard() {
  const [sortBy, setSortBy] = useState<SortKey>("revenue");
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api/partners/leaderboard/top');
        const data = await res.json();
        if (res.ok) setList(data.map((p: any, i: number) => ({
          rank: i + 1,
          name: p.name,
          sales: p.totalSales || 0,
          revenue: `₹${Math.round(p.totalSales * 4499 || 0)}`,
          earnings: `₹${Math.round(p.totalEarnings || 0)}`
        })));
      } catch (err) {
        // ignore
      }
    })();
  }, []);

  const sortedData = [...list].sort((a, b) => {
    if (sortBy === "sales") return b.sales - a.sales;
    // strip any non-numeric characters (currency symbols, commas) before parsing
    return parseFloat(b.revenue.replace(/[^\d.-]/g, "")) - parseFloat(a.revenue.replace(/[^\d.-]/g, ""));
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-400" />;
    return null;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-50 border-yellow-200";
    if (rank === 2) return "bg-gray-50 border-gray-200";
    if (rank === 3) return "bg-orange-50 border-orange-200";
    return "bg-background border-border";
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/20">
      <Header />

      <main className="flex-1 py-6 md:py-10">
        <div className="container max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Partner Leaderboard</h1>
          </div>

          {/* Full List */}
          <div className="bg-background rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-12 gap-2 md:gap-4 p-4 bg-secondary/50 text-sm font-medium text-muted-foreground">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Partner</div>
              <div className="col-span-2 text-right hidden sm:block">Sales</div>
              <div className="col-span-3 sm:col-span-2 text-right">Revenue</div>
              <div className="col-span-3 sm:col-span-2 text-right">Earnings</div>
            </div>

            {sortedData.map((partner, index) => (
              <div 
                key={partner.rank}
                className={`grid grid-cols-12 gap-2 md:gap-4 p-4 border-t items-center ${getRankStyle(index + 1)}`}
              >
                <div className="col-span-1">
                  <div className="flex items-center justify-center w-7 h-7">
                    {getRankIcon(index + 1) || (
                      <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                    )}
                  </div>
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                    {partner.avatar || (partner.name || '').split(' ').map((s:any)=>s[0]).slice(0,2).join('')}
                  </div>
                  <span className="font-medium">{partner.name}</span>
                </div>
                <div className="col-span-2 text-right text-muted-foreground hidden sm:block">
                  {partner.sales}
                </div>
                <div className="col-span-3 sm:col-span-2 text-right text-muted-foreground">
                  {partner.revenue}
                </div>
                <div className="col-span-3 sm:col-span-2 text-right font-semibold text-accent">
                  {partner.earnings}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Rankings update every 24 hours
          </p>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
