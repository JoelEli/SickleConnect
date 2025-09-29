import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Target, ArrowLeft, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Navigation */}
      <nav className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.ico" alt="SickleConnect Logo" className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-primary">SickleConnect</h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">About SickleConnect</h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            SickleConnect was created to bridge the gap in support and understanding 
            for individuals living with sickle cell disease and their families.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We believe that no one should face sickle cell disease alone. Our platform 
              provides a safe, supportive space where patients, families, and healthcare 
              professionals can connect, share experiences, and learn from each other.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Community First</h3>
                  <p className="text-muted-foreground">Building genuine connections between people who understand the journey.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Evidence-Based Support</h3>
                  <p className="text-muted-foreground">Connecting patients with qualified healthcare professionals.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Privacy & Safety</h3>
                  <p className="text-muted-foreground">Maintaining a secure environment for sensitive health discussions.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <Target className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  To create a world where everyone living with sickle cell disease 
                  has access to understanding, support, and quality care.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Fostering connections that lead to better health outcomes, 
                  reduced isolation, and improved quality of life.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive support for the sickle cell community
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Peer Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Connect with others who share similar experiences, challenges, and triumphs 
                  in managing sickle cell disease.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Access insights and advice from healthcare professionals who specialize 
                  in sickle cell care and treatment.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Discover and share valuable resources, tips, and strategies for 
                  living well with sickle cell disease.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Community Today</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Ready to connect with others who understand your journey? 
          Sign up now and become part of a supportive community.
        </p>
        <Link to="/auth">
          <Button size="lg">
            <Heart className="mr-2 h-4 w-4" />
            Get Started
          </Button>
        </Link>
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

export default About;
