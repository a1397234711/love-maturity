import React, { useState } from 'react';
import questionsData from './questions.json';

const App = () => {
  const [step, setStep] = useState('intro'); // 'intro', 'quiz', 'result'
  const [answers, setAnswers] = useState(Array(25).fill(3));
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const startQuiz = () => {
    setStep('quiz');
  };

  const handleAnswer = (score) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = score;
    setAnswers(newAnswers);
    if (currentQuestion < 24) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('result');
    }
  };

  const calculateResults = () => {
    const scores = {
      anxiety: 0, avoidance: 0, emotion: 0, esteem: 0,
      neuroticism: 0, agreeableness: 0, intimacyFear: 0, conflict: 0
    };
    let counts = { ...scores };

    questionsData.forEach((q, i) => {
      let score = answers[i];
      if (q.reverse) score = 6 - score;

      switch(q.dimension) {
        case 'anxiety': scores.anxiety += score; counts.anxiety++; break;
        case 'avoidance': scores.avoidance += score; counts.avoidance++; break;
        case 'reappraisal':
        case 'suppression': scores.emotion += score; counts.emotion++; break;
        case 'esteem': scores.esteem += score; counts.esteem++; break;
        case 'neuroticism': scores.neuroticism += score; counts.neuroticism++; break;
        case 'agreeableness': scores.agreeableness += score; counts.agreeableness++; break;
        case 'fear_intimacy': scores.intimacyFear += score; counts.intimacyFear++; break;
        default:
          if (q.dimension.includes('constructive') || q.dimension.includes('respectful')) {
            scores.conflict += score; counts.conflict++;
          } else {
            scores.conflict -= score; counts.conflict++;
          }
      }
    });

    return {
      attachment: ((scores.anxiety / counts.anxiety) + (scores.avoidance / counts.avoidance)) / 2,
      emotion: scores.emotion / counts.emotion,
      esteem: scores.esteem / counts.esteem,
      neuroticism: scores.neuroticism / counts.neuroticism,
      agreeableness: scores.agreeableness / counts.agreeableness,
      intimacyFear: scores.intimacyFear / counts.intimacyFear,
      conflict: scores.conflict / counts.conflict
    };
  };

  const getResultText = (value, type) => {
    if (type === 'attachment') {
      if (value > 3.5) return "较低 → 容易因小事怀疑对方或回避亲密";
      if (value < 2.5) return "较高 → 能自然地信任与依赖他人";
      return "中等 → 在亲密与独立间寻找平衡";
    }
    // 其他维度简化处理...
    return value > 3.5 ? "较强" : value < 2.5 ? "较弱" : "中等";
  };

  if (step === 'intro') {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>恋爱成熟度测评</h1>
        <p>本测试基于心理学研究，帮助你了解自己在亲密关系中的准备度。</p>
        <p><strong>免责声明：</strong>结果仅供参考，不构成心理诊断。我们不会保存你的答案。</p>
        <button onClick={startQuiz} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
          开始测试（共25题）
        </button>
      </div>
    );
  }

  if (step === 'quiz') {
    const q = questionsData[currentQuestion];
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <p>第 {currentQuestion + 1} / 25 题</p>
        <h2>{q.text}</h2>
        {[1,2,3,4,5].map(score => (
          <button key={score} onClick={() => handleAnswer(score)}
            style={{ display: 'block', width: '100%', padding: '10px', margin: '5px 0', fontSize: '16px' }}>
            {score === 1 ? '完全不符合' : 
             score === 2 ? '不太符合' :
             score === 3 ? '一般' :
             score === 4 ? '比较符合' : '非常符合'}
          </button>
        ))}
      </div>
    );
  }

  if (step === 'result') {
    const results = calculateResults();
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>你的恋爱成熟度报告</h1>
        <p><strong>依恋安全感：</strong>{getResultText(results.attachment, 'attachment')}</p>
        <p><strong>情绪调节力：</strong>{getResultText(results.emotion)}</p>
        <p><strong>自尊水平：</strong>{getResultText(results.esteem)}</p>
        <p><strong>情绪稳定性：</strong>{getResultText(results.neuroticism)}</p>
        <p><strong>亲密恐惧：</strong>{getResultText(results.intimacyFear)}</p>
        
        <h2>💡 成长建议</h2>
        <ul>
          <li>阅读《亲密关系》（罗兰·米勒）第4章</li>
          <li>练习“我感到...因为...”的非暴力沟通句式</li>
          <li>若长期焦虑，可拨打心理援助热线：400-161-9995</li>
        </ul>

        <div style={{ marginTop: '30px', fontSize: '14px', color: '#666', padding: '15px', backgroundColor: '#f9f9f9' }}>
          <p><strong>免责声明：</strong>本测试基于公开心理学研究编制，不构成临床诊断或治疗建议。本网站不收集个人身份信息，符合《个人信息保护法》。</p>
        </div>
      </div>
    );
  }
};

export default App;