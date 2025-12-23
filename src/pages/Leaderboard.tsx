import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Users, Star, Medal } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Sarah K.", avatar: "SK", sales: 342, revenue: "$17,100", earnings: "$8,550" },
  { rank: 2, name: "Mike R.", avatar: "MR", sales: 289, revenue: "$14,450", earnings: "$7,225" },
  { rank: 3, name: "Emma T.", avatar: "ET", sales: 256, revenue: "$12,800", earnings: "$6,400" },
  { rank: 4, name: "James L.", avatar: "JL", sales: 198, revenue: "$9,900", earnings: "$4,950" },
  { rank: 5, name: "Lisa M.", avatar: "LM", sales: 167, revenue: "$8,350", earnings: "$4,175" },
  { rank: 6, name: "David W.", avatar: "DW", sales: 145, revenue: "$7,250", earnings: "$3,625" },
  { rank: 7, name: "Anna P.", avatar: "AP", sales: 132, revenue: "$6,600", earnings: "$3,300" },
  { rank: 8, name: "Chris B.", avatar: "CB", sales: 118, revenue: "$5,900", earnings: "$2,950" },
  { rank: 9, name: "Nina S.", avatar: "NS", sales: 105, revenue: "$5,250", earnings: "$2,625" },
  { rank: 10, name: "Tom H.", avatar: "TH", sales: 98, revenue: "$4,900", earnings: "$2,450" },
];

type SortKey = "revenue" | "sales";

export default function Leaderboard() {
  const [sortBy, setSortBy] = useState<SortKey>("revenue");

  const sortedData = [...leaderboardData].sort((a, b) => {
    if (sortBy === "sales") return b.sales - a.sales;
    return parseFloat(b.revenue.replace(/[$,]/g, "")) - parseFloat(a.revenue.replace(/[$,]/g, ""));
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
            <p className="text-muted-foreground">Top performing partners this month</p>
          </div>

          {/* Top 3 Highlight */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
            {sortedData.slice(0, 3).map((partner, index) => (
              <div 
                key={partner.rank}
                className={`text-center p-4 md:p-6 rounded-xl border ${
                  index === 0 ? "bg-yellow-50 border-yellow-200 md:-mt-2" :
                  index === 1 ? "bg-gray-50 border-gray-200" :
                  "bg-orange-50 border-orange-200"
                }`}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-background border-2 border-current flex items-center justify-center mx-auto mb-3 text-lg md:text-xl font-bold">
                  {partner.avatar}
                </div>
                <div className="flex justify-center mb-2">
                  {getRankIcon(index + 1)}
                </div>
                <div className="font-semibold text-sm md:text-base">{partner.name}</div>
                <div className="text-accent font-bold text-lg md:text-xl mt-1">{partner.earnings}</div>
                <div className="text-xs text-muted-foreground mt-1">{partner.sales} sales</div>
              </div>
            ))}
          </div>

          {/* Sort Buttons */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={sortBy === "revenue" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("revenue")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              By Revenue
            </Button>
            <Button
              variant={sortBy === "sales" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("sales")}
            >
              <Users className="h-4 w-4 mr-2" />
              By Referrals
            </Button>
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
                    {partner.avatar}
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

      <Footer />
    </div>
  );
}
