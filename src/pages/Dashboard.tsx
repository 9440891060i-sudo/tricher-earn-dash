import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
// import { Footer } from "@/components/layout/Footer";
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
import apiFetch from '@/lib/api';

// placeholder icons mapping; values are loaded into `stats` state

const initialCodes: any[] = [];

export default function Dashboard() {
  const [stats, setStats] = useState({ totalSales: 0, totalEarnings: 0, codeUses: 0, pendingPayout: 0 });
  const [payoutsState, setPayoutsState] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>(initialCodes);
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
    (async () => {
      if (!newCode.trim()) {
        toast({ title: 'Error', description: 'Please enter a code name', variant: 'destructive' });
        return;
      }
      if (!isValid) {
        toast({ title: 'Error', description: 'Commission + Discount cannot exceed 25%', variant: 'destructive' });
        return;
      }
      try {
        const payload = {
          discount_value: discount,
          code: newCode.toUpperCase(),
          max_uses: 500,
          commission,
        };
        // create on local backend
        const data = await apiFetch('/api/coupons', { method: 'POST', body: JSON.stringify(payload) });
        // also create on external API
        try {
          const extRes = await fetch('https://api.tricher.app/api/coupons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('tricher_token') || ''}` },
            body: JSON.stringify(payload),
          });
          // ignore ext errors but log
          if (!extRes.ok) {
            const extErr = await extRes.json().catch(() => ({}));
            console.warn('External coupon create failed', extErr);
          }
        } catch (e) {
          console.warn('External create failed', e);
        }

        const uiItem = { id: data._id, code: data.code, commission: data.commission, discount: data.discount_value, uses: data.uses || 0, earnings: '₹0' };
        setCodes((c) => [uiItem, ...c]);
        setNewCode('');
        toast({ title: 'Code created!', description: `Your code ${data.code} is now active.` });
      } catch (err: any) {
        toast({ title: 'Error', description: err.error || err.message || 'Create coupon failed' });
      }
    })();
  };

  const handleDeleteCode = (id: number) => {
    (async () => {
      try {
        const item = codes.find((x) => x.id === id || x._id === id || x.code === id);
        if (!item) return;
        const code = item.code;
        // delete from local backend only
        await apiFetch(`/api/coupons/${code}`, { method: 'DELETE' });
        // remove locally from UI
        setCodes((list) => list.filter(c => c.code !== code));
        toast({ title: 'Code deleted', description: 'The discount code has been removed.' });
      } catch (err: any) {
        toast({ title: 'Error', description: err.error || err.message || 'Delete failed' });
      }
    })();
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

  const handleRequestPayout = async () => {
    const amount = stats.pendingPayout;
    if (!amount || amount <= 0) {
      toast({ title: 'No payout available', description: 'You have no pending payout to request.' });
      return;
    }
    try {
      const data = await apiFetch('/api/payouts/request', { method: 'POST', body: JSON.stringify({ amount }) });
      setPayoutsState((p) => [{ id: data._id, amount: `$${data.amount}`, status: data.status, date: new Date(data.requested_at).toLocaleDateString() }, ...p]);
      // clear pending payout locally
      setStats((s) => ({ ...s, pendingPayout: 0 }));
      toast({ title: 'Payout requested', description: 'Your payout request has been submitted for review.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.error || err.message || 'Request failed' });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const partnerRaw = localStorage.getItem('tricher_partner');
        if (!partnerRaw) return;
        const partner = JSON.parse(partnerRaw);
        // fetch partner metrics
        const pData = await apiFetch(`/api/partners/${partner.id}`);
        setStats({ totalSales: pData.totalSales || 0, totalEarnings: pData.totalEarnings || 0, codeUses: 0, pendingPayout: pData.pendingPayouts || 0 });

        // fetch coupons and compute earnings via usage endpoint
        const coupons = await apiFetch('/api/coupons');
        const codeItems: any[] = [];
        let aggSales = 0;
        let aggEarnings = 0;
        let aggUses = 0;
        for (const d of coupons) {
          // call external usage analytics for richer data
          let usage: any = { usageCount: 0, totalSales: 0 };
          try {
            const extRes = await fetch(`https://api.tricher.app/api/coupons/${d.code}/usage`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('tricher_token') || ''}` }
            });
            if (extRes.ok) usage = await extRes.json();
            else {
              // fallback to local usage if external fails
              usage = await apiFetch(`/api/coupons/${d.code}/usage`).catch(() => ({ usageCount: d.uses || 0, totalSales: 0 }));
            }
          } catch (e) {
            usage = await apiFetch(`/api/coupons/${d.code}/usage`).catch(() => ({ usageCount: d.uses || 0, totalSales: 0 }));
          }
          const totalSales = usage.totalSales || 0;
          const uses = usage.usageCount || d.uses || 0;
          const avgOrder = uses > 0 ? Math.round((totalSales / uses) * 100) / 100 : 0;
          const earnings = Math.round((totalSales * ((d.commission || 0) / 100)) * 100) / 100; // round to 2 decimals
          const commissionPerUse = uses > 0 ? Math.round((earnings / uses) * 100) / 100 : 0;
          aggSales += totalSales;
          aggEarnings += earnings;
          aggUses += uses;
          codeItems.push({ id: d._id, code: d.code, commission: d.commission, discount: d.discount_value, uses, earnings: `₹${earnings}`, avgOrder: `₹${avgOrder}`, commissionPerUse: `₹${commissionPerUse}` });
        }
        setCodes(codeItems);
        // update stats from aggregated coupon usage if partner metrics were zero
        setStats((s) => ({ ...s, codeUses: aggUses, totalSales: aggSales || s.totalSales, totalEarnings: Math.round((aggEarnings || s.totalEarnings) * 100) / 100 }));

        // fetch payouts
        const payouts = await apiFetch('/api/payouts');
        setPayoutsState(payouts.map((p: any) => ({ id: p._id, amount: `₹${p.amount}`, status: p.status, date: new Date(p.requested_at).toLocaleDateString() })));
      } catch (err) {
        // ignore
      }
    })();
  }, []);

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
            <div className="bg-background rounded-xl border border-border p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold">₹{stats.totalSales}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Sales</div>
            </div>

            <div className="bg-background rounded-xl border border-border p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold">₹{stats.totalEarnings}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Earnings</div>
            </div>

            <div className="bg-background rounded-xl border border-border p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold">{stats.codeUses}</div>
              <div className="text-sm text-muted-foreground mt-1">Code Uses</div>
            </div>

            <div className="bg-background rounded-xl border border-border p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold">₹{stats.pendingPayout}</div>
              <div className="text-sm text-muted-foreground mt-1">Pending Payout</div>
            </div>
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
                        <div className="text-xs text-muted-foreground">{code.uses} uses · Avg {code.avgOrder || ''} · Comm/use {code.commissionPerUse || ''}</div>
                        <div className="font-semibold text-accent mt-1">{code.earnings}</div>
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
                {stats.pendingPayout > 0 ? (
                <Button onClick={handleRequestPayout} size="sm" variant="accent">
                  Request Payout ({`₹${stats.pendingPayout}`})
                </Button>
              ) : (
                <Button disabled size="sm">
                  No Payout Available
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {payoutsState.map((payout) => (
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

      {/* <Footer /> */}
    </div>
  );
}
