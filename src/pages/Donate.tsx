import React, { useState } from 'react';
import { Heart, CreditCard, Shield, Users, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Donate = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();

  const presetAmounts = [25, 50, 100, 250, 500];

  const handleGoFundMeRedirect = () => {
    // Redirect to GoFundMe page
    window.open('https://gofundme.com/sickleconnect', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Support SickleConnect
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your donation helps us provide resources, support, and community for people living with sickle cell disease. 
            All donations are processed securely through GoFundMe.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Donation Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Make a Donation
              </CardTitle>
              <CardDescription>
                Every contribution makes a difference in our community. Click below to donate securely through GoFundMe.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Amount Selection */}
                <div className="space-y-4">
                  <Label>Donation Amount</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetAmounts.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={donationAmount === amount.toString() ? "default" : "outline"}
                        onClick={() => {
                          setDonationAmount(amount.toString());
                          setCustomAmount('');
                        }}
                        className="h-12"
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customAmount">Custom Amount</Label>
                    <Input
                      id="customAmount"
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setDonationAmount('');
                      }}
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Donor Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded"
                      aria-label="Donate anonymously"
                    />
                    <Label htmlFor="anonymous">Donate anonymously</Label>
                  </div>

                  {!isAnonymous && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="donorName">Your Name (Optional)</Label>
                        <Input
                          id="donorName"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder="Enter your name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="donorEmail">Email (Optional)</Label>
                        <Input
                          id="donorEmail"
                          type="email"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Leave a message of support..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select defaultValue="card">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="button" 
                  className="w-full h-12 text-lg bg-pink-600 hover:bg-pink-700"
                  onClick={handleGoFundMeRedirect}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Donate on GoFundMe
                </Button>
                
                <p className="text-sm text-muted-foreground text-center">
                  🔒 Secure donations processed by GoFundMe
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Impact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How Your Donation Helps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Community Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect patients, families, and caregivers in a supportive environment
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Stethoscope className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Medical Resources</h3>
                    <p className="text-sm text-muted-foreground">
                      Provide access to medical information and healthcare resources
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Platform Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Maintain secure, reliable infrastructure for our community
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donation Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">$25</span>
                    <span className="text-sm text-muted-foreground">Supports 1 month of platform hosting</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">$50</span>
                    <span className="text-sm text-muted-foreground">Enables 10 new user registrations</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">$100</span>
                    <span className="text-sm text-muted-foreground">Funds community outreach programs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">$250</span>
                    <span className="text-sm text-muted-foreground">Supports medical resource development</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
