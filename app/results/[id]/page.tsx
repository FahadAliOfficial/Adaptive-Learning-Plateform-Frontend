"use client"

import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Trophy,
    Target,
    TrendingDown,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Home,
    RotateCcw,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
} from "lucide-react"
import { useState, useEffect } from "react"

// Type definitions
type TopicResult = {
    name: string;
    accuracy: number;
}

type QuestionResult = {
    id: number;
    question: string;
    options: string[];
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
}

// Mock results data
const mockResults = {
    score: 8,
    totalQuestions: 10,
    accuracy: 80,
    timeTaken: "18:34",
    strongTopics: [
        { name: "Variables & Data Types", accuracy: 95 },
        { name: "Control Flow", accuracy: 90 },
    ],
    weakTopics: [
        { name: "Functions", accuracy: 65 },
        { name: "Object-Oriented Programming", accuracy: 55 },
    ],
    questions: [
        {
            id: 1,
            question: "What is the output of the following Python code: print(2 ** 3)?",
            options: ["5", "6", "8", "9"],
            selectedAnswer: 2,
            correctAnswer: 2,
            isCorrect: true,
            explanation: "The ** operator is used for exponentiation in Python. 2 ** 3 means 2 raised to the power of 3, which equals 8.",
        },
        {
            id: 2,
            question: "Which data type is used to store text in Python?",
            options: ["int", "str", "float", "bool"],
            selectedAnswer: 1,
            correctAnswer: 1,
            isCorrect: true,
            explanation: "The 'str' (string) data type is used to store text in Python. Strings can be enclosed in single or double quotes.",
        },
        {
            id: 3,
            question: "What keyword is used to define a function in Python?",
            options: ["function", "def", "func", "define"],
            selectedAnswer: 0,
            correctAnswer: 1,
            isCorrect: false,
            explanation: "The 'def' keyword is used to define a function in Python. Example: def my_function(): pass",
        },
        {
            id: 4,
            question: "Which of the following is a mutable data type in Python?",
            options: ["tuple", "string", "list", "integer"],
            selectedAnswer: 2,
            correctAnswer: 2,
            isCorrect: true,
            explanation: "Lists are mutable, meaning their contents can be changed after creation. Tuples, strings, and integers are immutable.",
        },
        {
            id: 5,
            question: "What does the 'len()' function return?",
            options: [
                "The type of an object",
                "The length of an object",
                "The value of an object",
                "The memory address",
            ],
            selectedAnswer: 1,
            correctAnswer: 1,
            isCorrect: true,
            explanation: "The len() function returns the length (number of items) of an object such as a string, list, tuple, or dictionary.",
        },
        {
            id: 6,
            question: "Which operator is used for floor division in Python?",
            options: ["/", "//", "%", "**"],
            selectedAnswer: 0,
            correctAnswer: 1,
            isCorrect: false,
            explanation: "The // operator performs floor division, which divides and rounds down to the nearest integer. The / operator performs regular division.",
        },
        {
            id: 7,
            question: "What is the correct way to create a dictionary in Python?",
            options: [
                "dict = []",
                "dict = ()",
                "dict = {}",
                "dict = <>",
            ],
            selectedAnswer: 2,
            correctAnswer: 2,
            isCorrect: true,
            explanation: "Dictionaries are created using curly braces {}. Example: my_dict = {'key': 'value'}",
        },
        {
            id: 8,
            question: "Which method is used to add an element to the end of a list?",
            options: ["add()", "append()", "insert()", "extend()"],
            selectedAnswer: 1,
            correctAnswer: 1,
            isCorrect: true,
            explanation: "The append() method adds a single element to the end of a list. Example: my_list.append(5)",
        },
        {
            id: 9,
            question: "What is the output of: bool(0)?",
            options: ["True", "False", "0", "None"],
            selectedAnswer: 1,
            correctAnswer: 1,
            isCorrect: true,
            explanation: "In Python, 0 is considered False when converted to a boolean. Other 'falsy' values include empty strings, empty lists, and None.",
        },
        {
            id: 10,
            question: "Which keyword is used to create a class in Python?",
            options: ["class", "Class", "def", "object"],
            selectedAnswer: 1,
            correctAnswer: 0,
            isCorrect: false,
            explanation: "The 'class' keyword (lowercase) is used to define a class in Python. Example: class MyClass: pass",
        },
    ],
}

export default function ResultsPage() {
    const router = useRouter()
    const params = useParams()
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
    const [results, setResults] = useState<any>(null)

    // Load test results from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedResults = localStorage.getItem('testResults')
            if (storedResults) {
                const parsedResults = JSON.parse(storedResults)
                
                // Format questions with isCorrect flag
                const formattedQuestions = parsedResults.questions.map((q: any, index: number) => ({
                    ...q,
                    selectedAnswer: parsedResults.answers[index] ?? -1,
                    isCorrect: parsedResults.answers[index] === q.correctAnswer,
                    explanation: q.explanation || "No explanation available."
                }))
                
                setResults({
                    ...parsedResults,
                    questions: formattedQuestions,
                    strongTopics: [],
                    weakTopics: [],
                })
            } else {
                // Fallback to mock data if no results found
                setResults(mockResults)
            }
        }
    }, [])

    const handlePracticeAgain = () => {
        if (results?.concept_id) {
            router.push(`/practice?concept=${results.concept_id}&mode=${results.mode}`)
        } else {
            router.push('/practice')
        }
    }

    if (!results) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading results...</p>
                </div>
            </div>
        )
    }
    const percentage = (results.score / results.totalQuestions) * 100

    const getGrade = (percentage: number) => {
        if (percentage >= 90) return { grade: "A+", color: "text-[rgb(var(--secondary))]" }
        if (percentage >= 80) return { grade: "A", color: "text-[rgb(var(--secondary))]" }
        if (percentage >= 70) return { grade: "B", color: "text-[rgb(var(--primary))]" }
        if (percentage >= 60) return { grade: "C", color: "text-[rgb(var(--accent))]" }
        return { grade: "D", color: "text-destructive" }
    }

    const grade = getGrade(percentage)

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
            <div className="container max-w-6xl px-4 py-8 mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    {/* <Button
            onClick={() => router.back()}
            variant="outline"
            className="h-10 w-10 p-0 flex items-center justify-center rounded-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button> */}
                    {/* Overall Score Card */}
                    <div className="text-center flex-1 mb-12">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-2xl shadow-emerald-500/50 mb-6 animate-in zoom-in duration-500">
                            <Trophy className="h-12 w-12 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent animate-gradient-x">Test Completed!</h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">Here's how you performed</p>
                    </div>

                </div>


                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-none bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/50">
                        <CardContent className="p-6 text-center">
                            <div className="text-5xl font-bold mb-2">
                                {grade.grade}
                            </div>
                            <div className="text-sm text-white/80">Grade</div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50">
                        <CardContent className="p-6 text-center">
                            <div className="text-5xl font-bold mb-2">
                                {results.score}/{results.totalQuestions}
                            </div>
                            <div className="text-sm text-white/80">Score</div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/50">
                        <CardContent className="p-6 text-center">
                            <div className="text-5xl font-bold mb-2">
                                {results.accuracy}%
                            </div>
                            <div className="text-sm text-white/80">Accuracy</div>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/50">
                        <CardContent className="p-6 text-center">
                            <div className="text-5xl font-bold mb-2">
                                {results.timeTaken}
                            </div>
                            <div className="text-sm text-white/80">Time Taken</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress Bar */}
                <Card className="mb-8 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                            <span>Overall Progress</span>
                            <span>{percentage.toFixed(0)}%</span>
                        </div>
                        <Progress value={percentage} className="h-4" />
                    </CardContent>
                </Card>

                {/* Analysis Grid */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Strong Topics */}
                    <Card className="border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-800 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                    <TrendingUp className="h-5 w-5 text-white" />
                                </div>
                                Strong Topics
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Topics where you performed well
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {results.strongTopics.map((topic: TopicResult, index: number) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{topic.name}</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{topic.accuracy}%</span>
                                    </div>
                                    <Progress value={topic.accuracy} className="h-2" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Areas to Improve - Scrollable */}
                    <Card className="border-red-200 dark:border-red-800 bg-white dark:bg-slate-800 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                                    <TrendingDown className="h-5 w-5 text-white" />
                                </div>
                                Areas to Improve
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Topics that need more practice
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3">
                                {results.weakTopics.map((topic: TopicResult, index: number) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">{topic.name}</span>
                                            <span className="text-red-600 dark:text-red-400 font-semibold">{topic.accuracy}%</span>
                                        </div>
                                        <Progress value={topic.accuracy} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card className="border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                    <Target className="h-5 w-5 text-white" />
                                </div>
                                Recommendations
                            </CardTitle>
                            <CardDescription className="dark:text-slate-400">
                                Suggested resources to improve
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                                {/* Placeholder recommendations - these will be populated dynamically */}
                                <a href="#" className="block p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <div className="font-medium text-sm text-slate-900 dark:text-white">Python Functions Tutorial</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Learn about function definitions and parameters</div>
                                </a>
                                <a href="#" className="block p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <div className="font-medium text-sm text-slate-900 dark:text-white">OOP Concepts in Python</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Master classes, objects, and inheritance</div>
                                </a>
                                <a href="#" className="block p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <div className="font-medium text-sm text-slate-900 dark:text-white">Python Practice Problems</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">50+ exercises to strengthen your skills</div>
                                </a>
                                <a href="#" className="block p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    <div className="font-medium text-sm text-slate-900 dark:text-white">Advanced Python Patterns</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Design patterns and best practices</div>
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RL Settings */}
                <Card className="mb-8 border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                                <Target className="h-5 w-5 text-white" />
                            </div>
                            RL Settings
                        </CardTitle>
                        <CardDescription className="dark:text-slate-400">
                            Reinforcement Learning configuration for this test
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Learning Rate</div>
                                <div className="text-lg font-bold text-slate-900 dark:text-white">0.001</div>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Discount Factor</div>
                                <div className="text-lg font-bold text-slate-900 dark:text-white">0.95</div>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Exploration Rate</div>
                                <div className="text-lg font-bold text-slate-900 dark:text-white">0.2</div>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Model Accuracy</div>
                                <div className="text-lg font-bold text-slate-900 dark:text-white">87.5%</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Question Review */}
                <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-slate-900 dark:text-white">Detailed Question Review</CardTitle>
                        <CardDescription className="dark:text-slate-400">
                            Review all questions with correct answers and explanations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {results.questions.map((question: QuestionResult, index: number) => (
                            <Card
                                key={question.id}
                                className={`border-2 ${question.isCorrect
                                        ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20"
                                        : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20"
                                    }`}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-semibold">Question {index + 1}</span>
                                                {question.isCorrect ? (
                                                    <CheckCircle2 className="h-5 w-5 text-[rgb(var(--secondary))]" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-destructive" />
                                                )}
                                            </div>
                                            <p className="text-sm">{question.question}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setExpandedQuestion(
                                                    expandedQuestion === question.id ? null : question.id
                                                )
                                            }
                                        >
                                            {expandedQuestion === question.id ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </CardHeader>

                                {expandedQuestion === question.id && (
                                    <CardContent className="space-y-4 pt-0">
                                        {/* Options */}
                                        <div className="space-y-2">
                                            {question.options.map((option, optIndex) => (
                                                <div
                                                    key={optIndex}
                                                    className={`p-3 rounded-lg border-2 ${optIndex === question.correctAnswer
                                                            ? "border-[rgb(var(--secondary))] bg-[rgb(var(--secondary))]/5"
                                                            : optIndex === question.selectedAnswer &&
                                                                !question.isCorrect
                                                                ? "border-destructive bg-destructive/5"
                                                                : "border-border"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {optIndex === question.correctAnswer && (
                                                            <CheckCircle2 className="h-4 w-4 text-[rgb(var(--secondary))]" />
                                                        )}
                                                        {optIndex === question.selectedAnswer &&
                                                            !question.isCorrect && (
                                                                <XCircle className="h-4 w-4 text-destructive" />
                                                            )}
                                                        <span className="text-sm">{option}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Explanation */}
                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <div className="text-sm font-semibold mb-2 flex items-center gap-2">
                                                <Target className="h-4 w-4" />
                                                Explanation
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {question.explanation}
                                            </p>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950"
                        onClick={() => router.push('/dashboard')}
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <Button
                        size="lg"
                        className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 shadow-lg shadow-emerald-500/50"
                        onClick={handlePracticeAgain}
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Practice Again
                    </Button>
                </div>
            </div>
        </div>
    )
}
