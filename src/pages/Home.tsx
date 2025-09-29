import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, MessageSquare, Shield, ArrowRight, Stethoscope, Search, CreditCard, MessageCircle } from 'lucide-react';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import HamburgerMenu from '@/shared/components/HamburgerMenu';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Navigation */}
      <nav className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/favicon.ico" alt="SickleConnect Logo" className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-primary">SickleConnect</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/search">
              <Button variant="ghost">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="ghost">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </Link>
            <Link to="/community">
              <Button variant="ghost">Community</Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Link to="/donate">
              <Button variant="default" className="bg-pink-600 hover:bg-pink-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Donate
              </Button>
            </Link>
            <ThemeToggle />
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <HamburgerMenu />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Connect. Share. Support.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join a supportive community of individuals living with sickle cell disease. 
            Share experiences, find support, and connect with healthcare professionals who understand your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Join Community
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose SickleConnect?</h2>
          <p className="text-lg text-muted-foreground">
            Built specifically for the sickle cell community
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Community Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Connect with others who truly understand your experiences with sickle cell disease.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Stethoscope className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Medical Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Access insights from healthcare professionals specialized in sickle cell care.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Safe Space</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Share your journey in a secure, judgment-free environment with people who care.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take the first step towards connecting with a community that understands. 
            Sign up today and start sharing your story.
          </p>
          <Link to="/auth">
            <Button size="lg">
              <Heart className="mr-2 h-4 w-4" />
              Join SickleConnect Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">SickleConnect</span>
          </div>
          <p className="text-muted-foreground">
            Building bridges in the sickle cell community, one connection at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
