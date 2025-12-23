import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageSquare, Mail, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How do I get paid?",
    answer: "You can request a payout anytime from your dashboard once you've earned at least $50. We process payouts within 3-5 business days via bank transfer or PayPal."
  },
  {
    question: "How does the 25% margin split work?",
    answer: "You have 25% total to work with. You decide how to split it between your commission (what you earn) and the customer discount (what they save). For example: 15% commission + 10% discount, or 20% commission + 5% discount."
  },
  {
    question: "When do I earn commissions?",
    answer: "You earn a commission every time someone makes a purchase using your referral code. Commissions are credited to your account immediately after the order is completed."
  },
  {
    question: "Can I have multiple discount codes?",
    answer: "Yes! You can create as many codes as you want with different commission/discount splits. This lets you test what works best for your audience."
  },
  {
    question: "How do I track my performance?",
    answer: "Your dashboard shows real-time analytics including total sales, code uses, earnings per code, and more. You can see exactly which codes are performing best."
  },
  {
    question: "What happens if a customer returns a product?",
    answer: "If a customer returns a product, the commission for that sale will be deducted from your balance. We only pay commissions on completed, non-refunded orders."
  },
];

export default function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/20">
      <Header />

      <main className="flex-1 py-6 md:py-10">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">How can we help?</h1>
            <p className="text-muted-foreground">Get answers or reach out to our team</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-background rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="font-semibold">Contact Support</h2>
                  <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="accent"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>Or email us directly at </span>
                  <a href="mailto:support@tricher.com" className="text-accent hover:underline">
                    support@tricher.com
                  </a>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-background rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold">Frequently Asked Questions</h2>
                  <p className="text-sm text-muted-foreground">Quick answers to common questions</p>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-sm hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
