import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Trophy, Target, Medal, MapPin, Calendar, User } from "lucide-react";
import heroAthletes from "@/assets/hero-athletes.jpg";

interface OnboardingData {
  name: string;
  dob: string;
  gender: string;
  district: string;
  state: string;
  school: string;
}

interface AthleteOnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

const AthleteOnboarding = ({ onComplete }: AthleteOnboardingProps) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    name: "",
    dob: "",
    gender: "",
    district: "",
    state: "",
    school: "",
  });

  const onboardingSteps = [
    {
      icon: Trophy,
      title: "स्वागत है Sportify में!",
      subtitle: "Unlock Your Athletic Potential",
      description: "भारत का पहला AI-powered athletic talent discovery platform। अपनी खेल प्रतिभा को unlock करें और SAI तक पहुंचें।",
      features: ["AI-powered pose analysis", "Real-time performance tracking", "SAI center connectivity"]
    },
    {
      icon: Target,
      title: "अपना Athletic Journey शुरू करें",
      subtitle: "Start Your Athletic Journey",
      description: "हमारे advanced ML models आपकी movements को analyze करके precise feedback देते हैं। हर rep count होता है!",
      features: ["Precision rep counting", "Posture error detection", "Performance insights"]
    },
    {
      icon: Medal,
      title: "Champions के साथ Compete करें",
      subtitle: "Compete with Champions",
      description: "District से National level तक compete करें। Leaderboards में अपनी position देखें और badges earn करें।",
      features: ["District & National leaderboards", "Achievement badges", "Progress tracking"]
    }
  ];

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < onboardingSteps.length) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const isFormValid = () => {
    return formData.name && formData.dob && formData.gender && formData.district && formData.state;
  };

  if (step < onboardingSteps.length) {
    const currentStep = onboardingSteps[step];
    const StepIcon = currentStep.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-saffron/10 via-white to-india-green/10 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <Card className="overflow-hidden shadow-[var(--shadow-athletic)] border-saffron/20">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Hero Image */}
                <div className="relative overflow-hidden">
                  <img 
                    src={heroAthletes} 
                    alt="Athletes training"
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-saffron/80 to-india-green/80 flex items-center justify-center">
                    <div className="text-center text-white p-6">
                      <StepIcon className="h-16 w-16 mx-auto mb-4 animate-float" />
                      <div className="text-lg font-semibold">Step {step + 1} of 3</div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col justify-center">
                  <div className="mb-8">
                    <h1 className="text-athletic-lg text-neutral-dark mb-2">
                      {currentStep.title}
                    </h1>
                    <p className="text-saffron font-medium text-lg mb-4">
                      {currentStep.subtitle}
                    </p>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {currentStep.description}
                    </p>
                    
                    <div className="space-y-3">
                      {currentStep.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-saffron animate-pulse"></div>
                          <span className="text-sm text-neutral-dark">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {onboardingSteps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === step ? 'bg-saffron' : 'bg-saffron/20'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <Button 
                      variant="hero" 
                      size="lg" 
                      onClick={handleNext}
                      className="gap-2"
                    >
                      आगे बढ़ें
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Registration Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron/10 via-white to-india-green/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-[var(--shadow-athletic)] border-saffron/20">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Trophy className="h-12 w-12 text-saffron mx-auto mb-4 animate-bounce-athletic" />
              <h1 className="text-athletic-lg text-neutral-dark mb-2">
                अपनी जानकारी दें
              </h1>
              <p className="text-saffron font-medium">Register Your Athletic Profile</p>
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-saffron" />
                    पूरा नाम / Full Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="अपना नाम लिखें"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="border-saffron/20 focus:border-saffron"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-saffron" />
                    जन्म तारीख / Date of Birth *
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="border-saffron/20 focus:border-saffron"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4 text-saffron" />
                    लिंग / Gender *
                  </Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="border-saffron/20 focus:border-saffron">
                      <SelectValue placeholder="चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">पुरुष / Male</SelectItem>
                      <SelectItem value="F">महिला / Female</SelectItem>
                      <SelectItem value="O">अन्य / Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-saffron" />
                    राज्य / State *
                  </Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                    <SelectTrigger className="border-saffron/20 focus:border-saffron">
                      <SelectValue placeholder="राज्य चुनें" />
                    </SelectTrigger>
                    <SelectContent>
  <SelectItem value="UP">उत्तर प्रदेश</SelectItem>
  <SelectItem value="MH">महाराष्ट्र</SelectItem>
  <SelectItem value="RJ">राजस्थान</SelectItem>
  <SelectItem value="KA">कर्नाटक</SelectItem>
  <SelectItem value="TN">तमिलनाडु</SelectItem>
  <SelectItem value="DL">दिल्ली</SelectItem>
  <SelectItem value="AP">आंध्र प्रदेश</SelectItem>
  <SelectItem value="AR">अरुणाचल प्रदेश</SelectItem>
  <SelectItem value="AS">असम</SelectItem>
  <SelectItem value="BR">बिहार</SelectItem>
  <SelectItem value="CG">छत्तीसगढ़</SelectItem>
  <SelectItem value="GA">गोवा</SelectItem>
  <SelectItem value="GJ">गुजरात</SelectItem>
  <SelectItem value="HR">हरियाणा</SelectItem>
  <SelectItem value="HP">हिमाचल प्रदेश</SelectItem>
  <SelectItem value="JH">झारखंड</SelectItem>
  <SelectItem value="KA">कर्नाटका</SelectItem>
  <SelectItem value="KL">केरल</SelectItem>
  <SelectItem value="MP">मध्य प्रदेश</SelectItem>
  <SelectItem value="MH">महाराष्ट्र</SelectItem>
  <SelectItem value="MN">मणिपुर</SelectItem>
  <SelectItem value="ML">मेघालय</SelectItem>
  <SelectItem value="MZ">मिजोरम</SelectItem>
  <SelectItem value="NL">नगालैंड</SelectItem>
  <SelectItem value="OD">ओडिशा</SelectItem>
  <SelectItem value="PB">पंजाब</SelectItem>
  <SelectItem value="RJ">राजस्थान</SelectItem>
  <SelectItem value="SK">सिक्किम</SelectItem>
  <SelectItem value="TN">तमिलनाडु</SelectItem>
  <SelectItem value="TS">तेलंगाना</SelectItem>
  <SelectItem value="UP">उत्तर प्रदेश</SelectItem>
  <SelectItem value="WB">पश्चिम बंगाल</SelectItem>
  <SelectItem value="J&K">जम्मू और कश्मीर</SelectItem>
  <SelectItem value="LD">लक्षद्वीप</SelectItem>
  <SelectItem value="AN">अंडमान और निकोबार द्वीपसमूह</SelectItem>
  <SelectItem value="CH">चंडीगढ़</SelectItem>
  <SelectItem value="DNH">दादरा और नगर हवेली और दमन और दीव</SelectItem>
  <SelectItem value="DL">दिल्ली</SelectItem>
  <SelectItem value="PY">पुदुचेरी</SelectItem>
</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-saffron" />
                  जिला / District *
                </Label>
                <Input
                  id="district"
                  placeholder="अपना जिला लिखें"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="border-saffron/20 focus:border-saffron"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-saffron" />
                  स्कूल/कॉलेज / School/College
                </Label>
                <Input
                  id="school"
                  placeholder="स्कूल का नाम (वैकल्पिक)"
                  value={formData.school}
                  onChange={(e) => handleInputChange('school', e.target.value)}
                  className="border-saffron/20 focus:border-saffron"
                />
              </div>

              <Button
                variant="hero"
                size="xl"
                onClick={handleNext}
                disabled={!isFormValid()}
                className="w-full"
              >
                Athletic Journey शुरू करें 🏆
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AthleteOnboarding;