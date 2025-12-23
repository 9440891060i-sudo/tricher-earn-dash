import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import apiFetch from "@/lib/api";

export default function ResetPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) return toast({ title: 'Error', description: 'Enter email' });
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/auth/forgot', { method: 'POST', body: JSON.stringify({ email }) });
      toast({ title: 'OTP Sent', description: 'Check your email for the OTP.' });
      // If dev token returned, save it so user can use it directly
      if ((res as any).token) setToken((res as any).token);
      setStep(2);
    } catch (err: any) {
      toast({ title: 'Error', description: err.error || err.message || 'Request failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!email || !otp) return toast({ title: 'Error', description: 'Enter email and OTP' });
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/auth/forgot/verify', { method: 'POST', body: JSON.stringify({ email, otp }) });
      toast({ title: 'OTP Verified', description: 'You may now set a new password.' });
      if ((res as any).token) setToken((res as any).token);
      setStep(3);
    } catch (err: any) {
      toast({ title: 'Error', description: err.error || err.message || 'Verification failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const submitNew = async () => {
    if (!password || !confirm) return toast({ title: 'Error', description: 'Enter and confirm password' });
    if (password !== confirm) return toast({ title: 'Error', description: 'Passwords do not match' });
    if (!token) return toast({ title: 'Error', description: 'Missing reset token' });
    setIsLoading(true);
    try {
      await apiFetch('/api/auth/reset', { method: 'POST', body: JSON.stringify({ token, password }) });
      toast({ title: 'Password Reset', description: 'You can now sign in with your new password.' });
      navigate('/');
    } catch (err: any) {
      toast({ title: 'Error', description: err.error || err.message || 'Reset failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Follow the steps to reset your password securely.</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <Button onClick={sendOtp} className="w-full" disabled={isLoading} variant="accent">{isLoading ? 'Sending...' : 'Send OTP'}</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="otp">OTP</Label>
                <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" />
              </div>
              <div className="flex gap-2">
                <Button onClick={verifyOtp} className="flex-1" disabled={isLoading}>{isLoading ? 'Verifying...' : 'Verify OTP'}</Button>
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              </div>
              {token && (
                <div className="text-sm text-muted-foreground">Dev token: <code className="font-mono">{token}</code></div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" />
              </div>
              <div>
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" />
              </div>
              <div className="flex gap-2">
                <Button onClick={submitNew} className="flex-1" disabled={isLoading}>{isLoading ? 'Saving...' : 'Set Password'}</Button>
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
