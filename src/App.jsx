import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';

const App = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calendarUrl = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1dDhVTC6nmAqTpQ744WdiVX5HYpBpJuieMFd2Bsk7-iFlARlw8EuBzT7ulHmXKp3ja2DPIdPsS?gv=true';
  const webhookUrl = 'https://services.leadconnectorhq.com/hooks/Yh5MFXsbWq36bxOSPUYh/webhook-trigger/5eb3eac7-f589-4d8c-a192-74960b865edf';

  // Memoize questions to prevent re-renders
  const questions = useMemo(() => [
    {
      id: 'founder-freedom',
      title: '1. Founder Freedom Check',
      subtitle: 'How involved is the founder in day-to-day operations?',
      options: [
        { text: 'Fully hands-on, running the show', value: 0 },
        { text: 'Mostly involved, but some delegation', value: 1 },
        { text: 'Rarely involved – they lead, not manage', value: 2 }
      ]
    },
    {
      id: 'decision-making',
      title: '2. Decision-Making',
      subtitle: 'How are big decisions made?',
      options: [
        { text: 'Mostly gut feel or habit', value: 0 },
        { text: 'Based on experience + some data', value: 1 },
        { text: 'Consistently data-backed, and AI helps spot patterns', value: 2 }
      ]
    },
    {
      id: 'automation-level',
      title: '3. Automation Level',
      subtitle: 'Could 30% of ops, finance, or service be automated tomorrow?',
      options: [
        { text: 'No chance – we\'re very manual', value: 0 },
        { text: 'Maybe – we\'ve started testing AI tools', value: 1 },
        { text: 'Absolutely – we already do this', value: 2 }
      ]
    },
    {
      id: 'sops-training',
      title: '4. SOPs & Training',
      subtitle: 'Who updates SOPs and trains new hires?',
      options: [
        { text: 'One of the team – when they remember', value: 0 },
        { text: 'We\'ve got written docs, but they\'re outdated', value: 1 },
        { text: 'It\'s automated. New staff get onboarded by bots', value: 2 }
      ]
    },
    {
      id: 'customer-interactions',
      title: '5. Customer Interactions',
      subtitle: 'How smart is your customer service?',
      options: [
        { text: 'All human. All the time.', value: 0 },
        { text: 'Hybrid – we use AI for FAQs or routing', value: 1 },
        { text: 'Mostly AI-led, and it learns constantly', value: 2 }
      ]
    },
    {
      id: 'ai-awareness',
      title: '6. AI Awareness',
      subtitle: 'Do you know which areas of your business AI could improve today?',
      options: [
        { text: 'Not really', value: 0 },
        { text: 'A few rough ideas', value: 1 },
        { text: 'Yes – we\'ve mapped it out and started actioning it', value: 2 }
      ]
    },
    {
      id: 'exit-alignment',
      title: '7. Exit Alignment',
      subtitle: 'Is there an AI strategy tied to increasing exit value?',
      options: [
        { text: 'No – we\'re just trying to survive the week', value: 0 },
        { text: 'It\'s loosely part of the growth plan', value: 1 },
        { text: 'Yes – it\'s embedded in our value creation strategy', value: 2 }
      ]
    }
  ], []);

  // Generate QR code on mount
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const url = await QRCode.toDataURL(calendarUrl, {
          width: 200,
          margin: 1,
          color: {
            dark: '#0A2342',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('QR Code generation failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    generateQRCode();
  }, [calendarUrl]);

  const handleAnswer = useCallback((questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setTimeout(() => setCurrentStep(questions.length), 300);
    }
  }, [currentStep, questions.length]);

  const calculateScore = useCallback(() => {
    return Object.values(answers).reduce((sum, value) => sum + value, 0);
  }, [answers]);

  const getResultData = useCallback(() => {
    const score = calculateScore();

    if (score >= 13) {
      return {
        title: 'Automation Leader',
        subtitle: 'You\'ve built what most business owners dream about.',
        description: 'Congratulations - you\'ve systematized operations, embedded AI throughout your business, make data-driven decisions, and have tied everything to exit value creation. You\'re in the top 5% of business owners. Your business runs without you, learns constantly, and increases in value daily.',
        color: '#00B2A9',
        emoji: '🏆',
        priorityActions: [
          'Document your methodology - it\'s valuable IP',
          'Consider when (not if) to exit or scale into new markets',
          'Share your journey - you could help other business owners transform'
        ]
      };
    } else if (score >= 9) {
      return {
        title: 'Scale Ready',
        subtitle: 'A few strategic tweaks and you\'ll be operating at maximum value.',
        description: 'You\'ve built solid systems, you\'re using data and AI in meaningful ways, and you\'re thinking strategically about exit value. You\'ve removed yourself from most daily operations. The remaining gaps are the difference between a good exit and a great one.',
        color: '#2E86AB',
        emoji: '🚀',
        priorityActions: [
          'Document your AI strategy as part of your investment thesis for buyers',
          'Optimize the 20% of operations still requiring your involvement',
          'Build predictive revenue models using your data infrastructure'
        ]
      };
    } else if (score >= 5) {
      return {
        title: 'System Skeptic',
        subtitle: 'You\'re in the dangerous middle - some systems, but not enough freedom.',
        description: 'You\'ve begun delegating and have dabbled with automation, but you\'re still the linchpin. You understand AI could help but haven\'t fully committed to implementing it. You\'re thinking about exit value, but it\'s not driving daily decisions. You\'re so close to breakthrough.',
        color: '#FFA500',
        emoji: '⚡',
        priorityActions: [
          'Identify your top 3 bottlenecks and assign AI solutions to each',
          'Move from \'experience + some data\' to fully data-driven decisions',
          'Tie every operational improvement directly to exit value metrics'
        ]
      };
    } else {
      return {
        title: 'Ops Dinosaur',
        subtitle: 'But the good news? You know now.',
        description: 'You\'re deeply embedded in day-to-day operations, making decisions by gut feel, and running mostly manual processes. This is normal for most business owners - but it\'s costing you time, money, and enterprise value. The gap between where you are and where you could be represents £X in unrealized business value.',
        color: '#FF6B6B',
        emoji: '🦕',
        priorityActions: [
          'Free yourself from decision bottlenecks - start with one approval process you can delegate',
          'Automate your biggest time-sink - usually customer service or marketing follow-ups',
          'Create your first exit-focused KPI dashboard'
        ]
      };
    }
  }, [calculateScore]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatAnswersForGHL = (answersObj) => {
    // Convert answers object to a readable format
    const questionLabels = {
      'founder-freedom': 'Founder Freedom',
      'decision-making': 'Decision Making',
      'automation-level': 'Automation Level',
      'sops-training': 'SOPs & Training',
      'customer-interactions': 'Customer Interactions',
      'ai-awareness': 'AI Awareness',
      'exit-alignment': 'Exit Alignment'
    };

    return Object.entries(answersObj)
      .map(([key, value]) => `${questionLabels[key]}: ${value}`)
      .join(' | ');
  };

  const submitEmailAndData = async () => {
    // Validate email
    if (!userEmail.trim()) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!validateEmail(userEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setIsSubmitting(true);

    const resultData = getResultData();
    const payload = {
      email: userEmail,
      answers: formatAnswersForGHL(answers),
      score: calculateScore(),
      result: resultData.title,
      timestamp: new Date().toISOString()
    };

    console.log('📤 Sending webhook to GHL...');
    console.log('Webhook URL:', webhookUrl);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('✅ Webhook response status:', response.status);
      console.log('Response status text:', response.statusText);

      const responseText = await response.text();
      console.log('Response body:', responseText);

      if (!response.ok) {
        console.error('❌ Webhook failed with status:', response.status);
      } else {
        console.log('✅ Webhook sent successfully!');
      }
    } catch (error) {
      console.error('❌ Error sending webhook:', error);
      console.error('Error details:', error.message);
    } finally {
      setIsSubmitting(false);
      // Move to results page regardless of webhook success
      setCurrentStep(questions.length + 1);
    }
  };

  const NorivaneWordmark = React.memo(({ isDark = false }) => (
    <div style={{
      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: isDark ? '#FFFFFF' : '#0A2342'
    }}>
      <span style={{ color: isDark ? '#FFFFFF' : '#0A2342' }}>nor</span>
      <span style={{
        color: '#00B2A9',
        fontStyle: 'italic',
        fontWeight: 400
      }}>i</span>
      <span style={{ color: isDark ? '#FFFFFF' : '#0A2342' }}>vane</span>
    </div>
  ));

  const ProgressBar = React.memo(() => {
    const progress = currentStep <= questions.length ? (currentStep / questions.length) * 100 : 100;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'rgba(255, 255, 255, 0.2)',
        zIndex: 1000
      }}>
        <motion.div
          style={{
            height: '100%',
            background: '#00B2A9',
            borderRadius: '0 2px 2px 0'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    );
  });

  const resetQuiz = useCallback(() => {
    setCurrentStep(-1);
    setAnswers({});
    setUserEmail('');
    setEmailError('');
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: 'white',
          fontSize: '1.2rem',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '1rem' }}>Loading...</div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid #00B2A9',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
      </div>
    );
  }

  // Welcome screen
  if (currentStep === -1) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vw, 2rem)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: 'clamp(2rem, 5vw, 3rem)',
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}
        >
          <NorivaneWordmark />

          <h1 style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            fontWeight: 700,
            color: '#0A2342',
            margin: '2rem 0 1rem',
            lineHeight: 1.2
          }}>
            The AI Litmus Test for Scalable Ops
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            color: '#212529',
            marginBottom: '1rem'
          }}>
            <em>(in Under 3 Minutes)</em>
          </p>

          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '12px',
            margin: '2rem 0',
            borderLeft: '4px solid #00B2A9'
          }}>
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
              color: '#212529',
              lineHeight: 1.6
            }}>
              🧠 <strong>Let's see how AI-ready your operations really are…</strong>
            </p>
            <p style={{
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              color: '#6c757d',
              marginTop: '0.5rem'
            }}>
              These questions are blunt—but so is the cost of not knowing.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentStep(0)}
            style={{
              background: '#00B2A9',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
              fontWeight: 600,
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 178, 169, 0.3)'
            }}
          >
            Ready? Let's Go! 🚀
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Question screens
  if (currentStep < questions.length) {
    const question = questions[currentStep];

    return (
      <>
        <ProgressBar />
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(1rem, 4vw, 2rem)'
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: 'clamp(2rem, 5vw, 3rem)',
                maxWidth: '700px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <NorivaneWordmark />
              </div>

              <h2 style={{
                fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
                fontWeight: 700,
                color: '#0A2342',
                marginBottom: '1rem'
              }}>
                {question.title}
              </h2>

              <p style={{
                fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                color: '#212529',
                marginBottom: '2rem',
                lineHeight: 1.5
              }}>
                {question.subtitle}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02, backgroundColor: '#f8f9fa' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(question.id, option.value)}
                    style={{
                      background: 'white',
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      color: '#212529'
                    }}
                  >
                    {option.text}
                  </motion.button>
                ))}
              </div>

              <div style={{
                textAlign: 'center',
                marginTop: '2rem',
                color: '#6c757d',
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
              }}>
                Question {currentStep + 1} of {questions.length}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </>
    );
  }

  // Email capture screen
  if (currentStep === questions.length) {
    return (
      <>
        <ProgressBar />
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(1rem, 4vw, 2rem)'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: 'clamp(2rem, 5vw, 3rem)',
              maxWidth: '600px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
            }}
          >
            <NorivaneWordmark />

            <div style={{
              fontSize: 'clamp(2.5rem, 6vw, 3rem)',
              margin: '1.5rem 0'
            }}>
              📊
            </div>

            <h2 style={{
              fontSize: 'clamp(1.6rem, 4.5vw, 2rem)',
              fontWeight: 700,
              color: '#0A2342',
              marginBottom: '1rem',
              lineHeight: 1.2
            }}>
              Get Your Personalised AI Readiness Report
            </h2>

            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
              color: '#6c757d',
              marginBottom: '2rem',
              lineHeight: 1.5
            }}>
              Enter your email to see your detailed results and personalised action plan
            </p>

            <div style={{
              marginBottom: '1.5rem',
              textAlign: 'left'
            }}>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => {
                  setUserEmail(e.target.value);
                  setEmailError('');
                }}
                placeholder="your.email@example.com"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                  border: emailError ? '2px solid #FF6B6B' : '2px solid #e9ecef',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  if (!emailError) {
                    e.target.style.borderColor = '#00B2A9';
                  }
                }}
                onBlur={(e) => {
                  if (!emailError) {
                    e.target.style.borderColor = '#e9ecef';
                  }
                }}
              />
              {emailError && (
                <p style={{
                  color: '#FF6B6B',
                  fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                  marginTop: '0.5rem',
                  textAlign: 'left'
                }}>
                  {emailError}
                </p>
              )}
            </div>

            <motion.button
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              whileTap={!isSubmitting ? { scale: 0.95 } : {}}
              onClick={submitEmailAndData}
              disabled={isSubmitting}
              style={{
                background: isSubmitting ? '#6c757d' : '#00B2A9',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                fontWeight: 600,
                borderRadius: '50px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(0, 178, 169, 0.3)',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Submitting...
                </>
              ) : (
                'See My Results 🚀'
              )}
            </motion.button>

            <p style={{
              fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
              color: '#6c757d',
              marginTop: '1rem',
              opacity: 0.8
            }}>
              We respect your privacy. Your email will only be used to send your results.
            </p>
          </motion.div>
        </div>
      </>
    );
  }

  // Results page
  const score = calculateScore();
  const percentageScore = Math.round((score / 14) * 100);
  const resultData = getResultData();

  return (
    <>
      <ProgressBar />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vw, 2rem)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: 'clamp(2rem, 5vw, 3rem)',
            maxWidth: '700px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}
        >
          <NorivaneWordmark />

          <div style={{
            fontSize: 'clamp(3rem, 8vw, 4rem)',
            margin: '1rem 0'
          }}>
            {resultData.emoji}
          </div>

          <div style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 800,
            color: '#0A2342', // Dark blue for contrast
            marginBottom: '0.5rem'
          }}>
            Score: {percentageScore}%
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 2.5rem)',
            fontWeight: 700,
            color: resultData.color,
            marginBottom: '1rem'
          }}>
            {resultData.title}
          </h2>

          <div style={{
            background: '#f8f9fa',
            padding: '2rem',
            borderRadius: '12px',
            margin: '2rem 0',
            borderLeft: `4px solid ${resultData.color}`
          }}>
            <p style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
              fontWeight: 600,
              color: '#212529',
              marginBottom: '0.5rem'
            }}>
              {resultData.subtitle}
            </p>
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
              color: '#6c757d',
              marginBottom: '2rem'
            }}>
              {resultData.description}
            </p>

            <div style={{ textAlign: 'left', marginTop: '2rem' }}>
              <h4 style={{
                color: '#0A2342',
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🎯 Top 3 Priority Actions:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {resultData.priorityActions.map((action, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.8rem',
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                  }}>
                    <span style={{
                      background: resultData.color,
                      color: 'white',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      flexShrink: 0,
                      marginTop: '0.1rem'
                    }}>{index + 1}</span>
                    <span style={{ fontSize: '0.95rem', color: '#495057' }}>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            background: '#0A2342',
            color: 'white',
            padding: '2rem',
            borderRadius: '12px',
            margin: '2rem 0'
          }}>
            <h3 style={{
              fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)',
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              📅 Book a Strategy Call
            </h3>
            <p style={{
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              marginBottom: '1.5rem',
              opacity: 0.9
            }}>
              Let's talk about how <strong>Norivane</strong> can help automate, scale, and get you deal-ready.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              <motion.a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: '#00B2A9',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '50px',
                  fontWeight: 600,
                  fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                  boxShadow: '0 4px 15px rgba(0, 178, 169, 0.3)'
                }}
              >
                Book 15-min Strategy Call 👉
              </motion.a>

              {qrCodeUrl && (
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={qrCodeUrl}
                    alt="QR Code for booking calendar appointment"
                    style={{
                      width: 'clamp(80px, 20vw, 100px)',
                      height: 'clamp(80px, 20vw, 100px)',
                      borderRadius: '8px'
                    }}
                  />
                  <p style={{
                    fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                    marginTop: '0.5rem',
                    opacity: 0.7
                  }}>
                    Scan to book
                  </p>
                </div>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetQuiz}
            style={{
              background: 'transparent',
              border: '2px solid #0A2342',
              color: '#0A2342',
              padding: '0.8rem 1.5rem',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              fontWeight: 500
            }}
          >
            Take Test Again
          </motion.button>
        </motion.div>
      </div>
    </>
  );
};

// Add spinning animation for loading
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default App;
