import { useState } from 'react';
import { QuizQuestion } from '../data/quizzes';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import { Progress } from './ui/progress';

interface QuizProps {
  title: string;
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export function Quiz({ title, questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const finalScore = selectedAnswers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correctAnswer ? 1 : 0);
      }, 0);
      setScore(finalScore);
      setShowResults(true);
      onComplete?.(finalScore, questions.length);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const percentage = Math.round((score / questions.length) * 100);

  if (showResults) {
    return (
      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e9f5e1' }}>
              <Award className="w-10 h-10" style={{ color: '#4F772D' }} />
            </div>
          </div>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div>
            <div className="text-5xl font-bold mb-2" style={{ color: '#4F772D' }}>
              {percentage}%
            </div>
            <p className="text-gray-600">
              You scored {score} out of {questions.length}
            </p>
          </div>

          <div className="space-y-4 text-left">
            <h4 className="font-semibold">Review Your Answers:</h4>
            {questions.map((question, index) => {
              const isCorrect = selectedAnswers[index] === question.correctAnswer;
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect ? 'bg-green-50' : 'bg-red-50'
                  }`}
                  style={isCorrect ? { borderColor: '#4F772D' } : { borderColor: '#fca5a5' }}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#4F772D' }} />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.question}</p>
                      {!isCorrect && (
                        <div className="space-y-1 text-sm">
                          <p className="text-red-700">
                            Your answer: {question.options[selectedAnswers[index]]}
                          </p>
                          <p style={{ color: '#4F772D' }}>
                            Correct answer: {question.options[question.correctAnswer]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Button onClick={handleRetake} variant="outline" className="w-full">
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const hasSelected = selectedAnswers[currentQuestion] !== undefined;

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? 'bg-green-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                style={
                  selectedAnswers[currentQuestion] === index
                    ? { borderColor: '#4F772D', backgroundColor: '#e9f5e1' }
                    : { borderColor: '#e5e7eb' }
                }
                onMouseEnter={(e) => {
                  if (selectedAnswers[currentQuestion] !== index) {
                    e.currentTarget.style.borderColor = '#4F772D';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAnswers[currentQuestion] !== index) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedAnswers[currentQuestion] === index
                        ? ''
                        : 'border-gray-300'
                    }`}
                    style={
                      selectedAnswers[currentQuestion] === index
                        ? { borderColor: '#4F772D', backgroundColor: '#4F772D' }
                        : {}
                    }
                  >
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!hasSelected}
            className="bg-green-700 hover:bg-green-800"
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}