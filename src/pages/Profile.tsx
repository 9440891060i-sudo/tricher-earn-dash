import { Header } from "@/components/layout/Header";
// import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import apiFetch from "@/lib/api";
import { User, Instagram, Youtube, Twitter, Wallet, Building2, CreditCard, Upload, IdCard, MapPin } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 890",
    bio: "",
  });

  const [socialMedia, setSocialMedia] = useState({
    platform: "instagram",
    handle: "@johndoe",
    followers: "50000",
  });

  const [payment, setPayment] = useState({
    method: "bank",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    cryptoWallet: "",
    cryptoNetwork: "trc20",
  });

  const INDIAN_BANKS = [
    "State Bank of India (SBI)",
    "Punjab National Bank (PNB)",
    "Bank of Baroda",
    "Bank of India",
    "Canara Bank",
    "Central Bank of India",
    "Indian Bank",
    "Indian Overseas Bank",
    "UCO Bank",
    "Union Bank of India",
    "Bank of Maharashtra",
    "Punjab & Sind Bank",
    "Axis Bank",
    "HDFC Bank",
    "ICICI Bank",
    "Kotak Mahindra Bank",
    "IndusInd Bank",
    "IDBI Bank",
    "IDFC First Bank",
    "Bandhan Bank",
    "CSB Bank",
    "City Union Bank",
    "DCB Bank",
    "Dhanlaxmi Bank",
    "Federal Bank",
    "Yes Bank",
    "South Indian Bank",
    "Karnataka Bank",
    "Karur Vysya Bank",
  ];

  const [showBankSuggestions, setShowBankSuggestions] = useState(false);

  const [identity, setIdentity] = useState({
    address: "",
    city: "",
    country: "",
    postalCode: "",
    idType: "national_id",
    idNumber: "",
    idDocument: null as File | null,
  });

  const handleSaveProfile = () => {
    (async () => {
      try {
        const partnerRaw = localStorage.getItem('tricher_partner');
        if (!partnerRaw) throw new Error('Please sign in');
        const partner = JSON.parse(partnerRaw);
        const payload = { name: profile.fullName, email: profile.email, phone: profile.phone };
        const updated = await apiFetch(`/api/partners/${partner.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        localStorage.setItem('tricher_partner', JSON.stringify({ id: updated._id, name: updated.name, email: updated.email }));
        toast({ title: 'Profile Updated', description: 'Your personal information has been saved.' });
      } catch (err: any) {
        toast({ title: 'Error', description: err.error || err.message || 'Update failed' });
      }
    })();
  };

  const handleSaveSocial = () => {
    (async () => {
      try {
        const partnerRaw = localStorage.getItem('tricher_partner');
        if (!partnerRaw) throw new Error('Please sign in');
        const partner = JSON.parse(partnerRaw);
        const payload = { social: { platform: socialMedia.platform, handle: socialMedia.handle, followers: socialMedia.followers } };
        const updated = await apiFetch(`/api/partners/${partner.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        toast({ title: 'Social Media Updated', description: 'Your social media information has been saved.' });
      } catch (err: any) {
        toast({ title: 'Error', description: err.error || err.message || 'Update failed' });
      }
    })();
  };

  const handleSavePayment = () => {
    (async () => {
      try {
        const partnerRaw = localStorage.getItem('tricher_partner');
        if (!partnerRaw) throw new Error('Please sign in');
        const partner = JSON.parse(partnerRaw);
        let payload: any = {};
        if (payment.method === 'bank') {
          payload = { bank: { bankName: payment.bankName, accountNumber: payment.accountNumber, ifscCode: payment.ifscCode, accountHolderName: payment.accountHolderName } };
        } else if (payment.method === 'crypto') {
          payload = { crypto: { wallet: payment.cryptoWallet, network: payment.cryptoNetwork } };
        }
        const updated = await apiFetch(`/api/partners/${partner.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        toast({ title: 'Payment Details Updated', description: 'Your payment information has been saved securely.' });
      } catch (err: any) {
        toast({ title: 'Error', description: err.error || err.message || 'Update failed' });
      }
    })();
  };

  const handleSaveIdentity = () => {
    (async () => {
      try {
        const partnerRaw = localStorage.getItem('tricher_partner');
        if (!partnerRaw) throw new Error('Please sign in');
        const partner = JSON.parse(partnerRaw);
        if (!identity.idDocument) throw new Error('No document selected');
        const fd = new FormData();
        fd.append('document', identity.idDocument as File);
        // use apiFetch so Authorization header is attached and Content-Type is correct for FormData
        const data = await apiFetch('/api/identity/upload', { method: 'POST', body: fd });
        // update partner identity reference
        await apiFetch(`/api/partners/${partner.id}`, { method: 'PUT', body: JSON.stringify({ identity: { idDocument: data.filename, idNumber: identity.idNumber, idType: identity.idType } }) });
        toast({ title: 'Identity Submitted', description: 'Your documents were uploaded.' });
      } catch (err: any) {
        toast({ title: 'Error', description: err.error || err.message || 'Upload failed' });
      }
    })();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdentity({ ...identity, idDocument: file });
      toast({
        title: "Document Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const partnerRaw = localStorage.getItem('tricher_partner');
        if (!partnerRaw) return;
        const partner = JSON.parse(partnerRaw);
        const data = await apiFetch(`/api/partners/${partner.id}`);
        setProfile({ fullName: data.name || '', email: data.email || '', phone: data.phone || '', bio: '' });
        if (data.social) setSocialMedia({ platform: data.social.platform || 'instagram', handle: data.social.handle || '', followers: data.social.followers || '' });
        if (data.bank) setPayment({ ...payment, method: 'bank', bankName: data.bank.bankName || '', accountNumber: data.bank.accountNumber || '', ifscCode: data.bank.ifscCode || '', accountHolderName: data.bank.accountHolderName || '' });
        else if (data.crypto) setPayment({ ...payment, method: 'crypto', cryptoWallet: data.crypto.wallet || '', cryptoNetwork: data.crypto.network || 'trc20' });
        if (data.identity) setIdentity({ ...identity, idNumber: data.identity.idNumber || '', idDocument: null });
      } catch (err) {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [payoutAmount, setPayoutAmount] = useState(0);

  const requestPayout = async () => {
    try {
      const res = await apiFetch('/api/payouts/request', { method: 'POST', body: JSON.stringify({ amount: payoutAmount }) });
      toast({ title: 'Payout requested', description: `Requested ${payoutAmount}` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.error || err.message || 'Request failed' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account details and payment preferences
            </p>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-auto">
              <TabsTrigger value="personal" className="flex flex-col gap-1 py-3">
                <User className="h-4 w-4" />
                <span className="text-xs">Personal</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex flex-col gap-1 py-3">
                <Instagram className="h-4 w-4" />
                <span className="text-xs">Social</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex flex-col gap-1 py-3">
                <Wallet className="h-4 w-4" />
                <span className="text-xs">Payment</span>
              </TabsTrigger>
              <TabsTrigger value="identity" className="flex flex-col gap-1 py-3">
                <IdCard className="h-4 w-4" />
                <span className="text-xs">Identity</span>
              </TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-accent" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your basic profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                  <Button variant="accent" onClick={handleSaveProfile} className="w-full">
                    Save Personal Info
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Media */}
            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-accent" />
                    Social Media
                  </CardTitle>
                  <CardDescription>
                    Where will you be posting content?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Primary Platform</Label>
                    <Select
                      value={socialMedia.platform}
                      onValueChange={(value) => setSocialMedia({ ...socialMedia, platform: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">
                          <div className="flex items-center gap-2">
                            <Instagram className="h-4 w-4" />
                            Instagram
                          </div>
                        </SelectItem>
                        <SelectItem value="youtube">
                          <div className="flex items-center gap-2">
                            <Youtube className="h-4 w-4" />
                            YouTube
                          </div>
                        </SelectItem>
                        <SelectItem value="twitter">
                          <div className="flex items-center gap-2">
                            <Twitter className="h-4 w-4" />
                            Twitter / X
                          </div>
                        </SelectItem>
                        <SelectItem value="tiktok">
                          <div className="flex items-center gap-2">
                            <span className="h-4 w-4 flex items-center justify-center text-xs font-bold">T</span>
                            TikTok
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="handle">Username / Handle</Label>
                    <Input
                      id="handle"
                      value={socialMedia.handle}
                      onChange={(e) => setSocialMedia({ ...socialMedia, handle: e.target.value })}
                      placeholder="@yourhandle"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="followers">Follower Count</Label>
                    <Input
                      id="followers"
                      type="number"
                      value={socialMedia.followers}
                      onChange={(e) => setSocialMedia({ ...socialMedia, followers: e.target.value })}
                      placeholder="Enter follower count"
                    />
                  </div>
                  <Button variant="accent" onClick={handleSaveSocial} className="w-full">
                    Save Social Media Info
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Details */}
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-accent" />
                    Payment Details
                  </CardTitle>
                  <CardDescription>
                    How would you like to receive your payouts?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select
                      value={payment.method}
                      onValueChange={(value) => setPayment({ ...payment, method: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Bank Transfer
                          </div>
                        </SelectItem>
                        <SelectItem value="crypto">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            Crypto (USDT)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {payment.method === "bank" && (
                    <>
                      <div className="space-y-2 relative">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          value={payment.bankName}
                          onChange={(e) => setPayment({ ...payment, bankName: e.target.value })}
                          onFocus={() => setShowBankSuggestions(true)}
                          placeholder="Start typing to see suggestions"
                        />

                        {showBankSuggestions && payment.bankName.trim().length > 0 && (
                          <ul className="absolute left-0 right-0 z-20 mt-1 bg-background border border-border rounded-md shadow-sm max-h-44 overflow-auto">
                            {INDIAN_BANKS.filter((b) =>
                              b.toLowerCase().includes(payment.bankName.toLowerCase())
                            )
                              .slice(0, 8)
                              .map((b) => (
                                <li
                                  key={b}
                                  onMouseDown={(e) => {
                                    // use onMouseDown to set before input blur
                                    e.preventDefault();
                                    setPayment({ ...payment, bankName: b });
                                    setShowBankSuggestions(false);
                                  }}
                                  className="px-3 py-2 cursor-pointer hover:bg-accent/10"
                                >
                                  {b}
                                </li>
                              ))}
                          </ul>
                        )}
                        <div
                          onBlur={() => setTimeout(() => setShowBankSuggestions(false), 150)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountHolderName">Account Holder Name</Label>
                        <Input
                          id="accountHolderName"
                          value={payment.accountHolderName}
                          onChange={(e) => setPayment({ ...payment, accountHolderName: e.target.value })}
                          placeholder="Enter account holder name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            value={payment.accountNumber}
                            onChange={(e) => setPayment({ ...payment, accountNumber: e.target.value })}
                            placeholder="Account number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ifscCode">IFSC Code</Label>
                          <Input
                            id="ifscCode"
                            value={payment.ifscCode}
                            onChange={(e) => setPayment({ ...payment, ifscCode: e.target.value })}
                            placeholder="IFSC code (e.g., HDFC0000123)"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {payment.method === "crypto" && (
                    <>
                      <div className="space-y-2">
                        <Label>Network</Label>
                        <Select
                          value={payment.cryptoNetwork}
                          onValueChange={(value) => setPayment({ ...payment, cryptoNetwork: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select network" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="trc20">TRC-20 (Tron)</SelectItem>
                            <SelectItem value="erc20">ERC-20 (Ethereum)</SelectItem>
                            <SelectItem value="bep20">BEP-20 (BSC)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cryptoWallet">USDT Wallet Address</Label>
                        <Input
                          id="cryptoWallet"
                          value={payment.cryptoWallet}
                          onChange={(e) => setPayment({ ...payment, cryptoWallet: e.target.value })}
                          placeholder="Enter your USDT wallet address"
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          Make sure you're entering a {payment.cryptoNetwork.toUpperCase()} compatible address
                        </p>
                      </div>
                    </>
                  )}

                  <Button variant="accent" onClick={handleSavePayment} className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Save Payment Details
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Identity Verification */}
            <TabsContent value="identity">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IdCard className="h-5 w-5 text-accent" />
                    Identity Verification
                  </CardTitle>
                  <CardDescription>
                    Required for payouts over $500
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={identity.address}
                      onChange={(e) => setIdentity({ ...identity, address: e.target.value })}
                      placeholder="Enter your street address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={identity.city}
                        onChange={(e) => setIdentity({ ...identity, city: e.target.value })}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={identity.postalCode}
                        onChange={(e) => setIdentity({ ...identity, postalCode: e.target.value })}
                        placeholder="Postal code"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={identity.country}
                      onChange={(e) => setIdentity({ ...identity, country: e.target.value })}
                      placeholder="Enter your country"
                    />
                  </div>

                  <div className="border-t border-border pt-4 mt-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      ID Document
                    </h4>
                    <div className="space-y-2">
                      <Label>Document Type</Label>
                      <Select
                        value={identity.idType}
                        onValueChange={(value) => setIdentity({ ...identity, idType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="national_id">National ID Card</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="drivers_license">Driver's License</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input
                        id="idNumber"
                        value={identity.idNumber}
                        onChange={(e) => setIdentity({ ...identity, idNumber: e.target.value })}
                        placeholder="Enter your ID number"
                      />
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label>Upload Document</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer">
                        <input
                          type="file"
                          id="idDocument"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label htmlFor="idDocument" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          {identity.idDocument ? (
                            <p className="text-sm text-accent font-medium">{identity.idDocument.name}</p>
                          ) : (
                            <>
                              <p className="text-sm font-medium">Click to upload</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                JPG, PNG or PDF (max 5MB)
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button variant="accent" onClick={handleSaveIdentity} className="w-full">
                    Submit for Verification
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
