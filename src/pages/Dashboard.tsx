import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  TrendingUp, 
  Tag, 
  Clock,
  Plus,
  Copy,
  Trash2,
  Check
} from "lucide-react";

const statsData = [
  { label: "Total Sales", value: "$12,450", icon: DollarSign, change: "+12%" },
  { label: "Total Earnings", value: "$3,112", icon: TrendingUp, change: "+8%" },
  { label: "Code Uses", value: "847", icon: Tag, change: "+23%" },
  { label: "Pending Payout", value: "$450", icon: Clock, change: null },
];

const initialCodes = [
  { id: 1, code: "SARAH15", commission: 15, discount: 10, uses: 234, earnings: "$1,755" },
  { id: 2, code: "SARAH10", commission: 10, discount: 15, uses: 156, earnings: "$780" },
];

const payoutHistory = [
  { id: 1, amount: "$500", status: "paid", date: "Dec 15, 2024" },
  { id: 2, amount: "$750", status: "paid", date: "Nov 15, 2024" },
  { id: 3, amount: "$450", status: "pending", date: "Dec 20, 2024" },
];

export default function Dashboard() {
  const [codes, setCodes] = useState(initialCodes);
  const [newCode, setNewCode] = useState("");
  const [commission, setCommission] = useState(15);
  const [discount, setDiscount] = useState(10);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const remaining = 25 - commission - discount;
  const isValid = remaining >= 0 && commission >= 0 && discount >= 0;

  const handleCommissionChange = (value: number[]) => {
    const newCommission = value[0];
    if (newCommission + discount <= 25) {
      setCommission(newCommission);
    }
  };

  const handleDiscountChange = (value: number[]) => {
    const newDiscount = value[0];
    if (commission + newDiscount <= 25) {
      setDiscount(newDiscount);
    }
  };

  const handleCreateCode = () => {
    if (!newCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a code name",
        variant: "destructive",
      });
      return;
    }

    if (!isValid) {
      toast({
        title: "Error",
        description: "Commission + Discount cannot exceed 25%",
        variant: "destructive",
      });
      return;
    }

    const code = {
      id: Date.now(),
      code: newCode.toUpperCase(),
      commission,
      discount,
      uses: 0,
      earnings: "$0",
    };

    setCodes([code, ...codes]);
    setNewCode("");
    toast({
      title: "Code created!",
      description: `Your code ${code.code} is now active.`,
    });
  };

  const handleDeleteCode = (id: number) => {
    setCodes(codes.filter(c => c.id !== id));
    toast({
      title: "Code deleted",
      description: "The discount code has been removed.",
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast({
      title: "Copied!",
      description: `${code} copied to clipboard`,
    });
  };

  const handleRequestPayout = () => {
    toast({
      title: "Payout requested",
      description: "Your payout request has been submitted for review.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/20">
      <Header />

      <main className="flex-1 py-6 md:py-10">
        <div className="container max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Partner Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData.map((stat) => (
              <div key={stat.label} className="bg-background rounded-xl border border-border p-4 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {stat.change && (
                    <span className="text-xs font-medium text-success">{stat.change}</span>
                  )}
                </div>
                <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Discount Code Manager */}
          <div className="bg-background rounded-xl border border-border p-6 mb-8">
            <h2 className="text-lg font-semibold mb-6">Create Discount Code</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code Name</Label>
                  <Input
                    id="code"
                    placeholder="e.g. MYCODE10"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    className="h-12"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Your Commission</Label>
                    <span className="text-lg font-semibold text-accent">{commission}%</span>
                  </div>
                  <Slider
                    value={[commission]}
                    onValueChange={handleCommissionChange}
                    max={25}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Customer Discount</Label>
                    <span className="text-lg font-semibold">{discount}%</span>
                  </div>
                  <Slider
                    value={[discount]}
                    onValueChange={handleDiscountChange}
                    max={25}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className={`p-4 rounded-xl border-2 ${isValid ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
                  <div className="text-sm text-muted-foreground mb-2">Total Margin Used</div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${isValid ? "text-foreground" : "text-destructive"}`}>
                      {commission + discount}%
                    </span>
                    <span className="text-muted-foreground">/ 25%</span>
                  </div>
                  <div className="mt-3 text-sm">
                    <span className={remaining >= 0 ? "text-success" : "text-destructive"}>
                      {remaining >= 0 ? `${remaining}% remaining` : "Exceeds limit!"}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleCreateCode} 
                  disabled={!isValid || !newCode.trim()}
                  className="mt-4"
                  variant="accent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Code
                </Button>
              </div>
            </div>
          </div>

          {/* Active Codes */}
          <div className="bg-background rounded-xl border border-border p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Your Codes</h2>

            {codes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No codes yet. Create your first code above!</p>
            ) : (
              <div className="space-y-3">
                {codes.map((code) => (
                  <div 
                    key={code.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-semibold text-lg">{code.code}</code>
                        <button 
                          onClick={() => handleCopyCode(code.code)}
                          className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                        >
                          {copiedCode === code.code ? (
                            <Check className="h-4 w-4 text-success" />
                          ) : (
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                      <div className="text-sm text-muted-foreground hidden sm:block">
                        {code.commission}% commission · {code.discount}% discount
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-sm">
                        <span className="text-muted-foreground">{code.uses} uses</span>
                        <span className="mx-2 text-border">·</span>
                        <span className="font-semibold text-accent">{code.earnings}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteCode(code.id)}
                        className="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payouts */}
          <div className="bg-background rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Payouts</h2>
              <Button onClick={handleRequestPayout} size="sm" variant="accent">
                Request Payout
              </Button>
            </div>

            <div className="space-y-3">
              {payoutHistory.map((payout) => (
                <div 
                  key={payout.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border"
                >
                  <div>
                    <div className="font-semibold">{payout.amount}</div>
                    <div className="text-sm text-muted-foreground">{payout.date}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    payout.status === "paid" 
                      ? "bg-success/10 text-success" 
                      : payout.status === "pending"
                      ? "bg-warning/10 text-warning"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
