import type { Accessor, Component } from 'solid-js';
import { createSignal, Show } from 'solid-js';
import micro from './assets/img.png';


const emotions = [
  {name: 'anger', emoji: '😡'},
  {name: 'contempt', emoji: '😒'},
  {name: 'disgust', emoji: '🤢'},
  {name: 'fear', emoji: '😱'},
  {name: 'happiness', emoji: '😀'},
  {name: 'neutral', emoji: '😐'},
  {name: 'sadness', emoji: '😢'},
  {name: 'surprise', emoji: '😮'},
  {name: 'joy', emoji: '😂'},
] as const;


export const App: Component = () => {
  const [hasMicrophone, setHasMicrophone] = createSignal(false);
  getLocalStream().then(success => setHasMicrophone(success));

  const [count, setCount] = createSignal(0);
  const [loaderText, setLoaderText] = createSignal('Loading...');
  const [isLoading, setIsLoading] = createSignal(false);
  const [isInitial, setIsInitial] = createSignal(true);
  const [currentEmotion, setCurrentEmotion] = createSignal(emotions[0] as typeof emotions[number]);

  const onStart = () => {
    setCount(10);
    setLoaderText('Loading...');
    setIsLoading(true);
    setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
    setIsInitial(false);

    const interval = setInterval(() => {
      setCount(count() - 1);
    }, 1_000);
    setTimeout(() => {
      clearInterval(interval);
      setCount(0);
      setLoaderText('Processing...');
    }, 10_000);
    setTimeout(() => {
      setIsLoading(false);
    }, 13_000);
  };

  return (
    <div>

      <Show when={count()} keyed={false}>
        <Counter current={count}/>
      </Show>

      <Show when={isLoading()} keyed={false}>
        <Loader text={loaderText}/>
      </Show>

      <Show when={!isLoading()} keyed={false}>
        {isInitial() ? (
          <button disabled={!hasMicrophone()} class="start" onClick={onStart}>
            Start
          </button>
        ) : (
          <>
            <h2 class="results__title">YOUR MOOD IS</h2>
            <span class="results__emotion">
              <span class="results__emoji">{currentEmotion().emoji}</span> {currentEmotion().name}
            </span>
            <button class="try-again" onClick={onStart}>Try again</button>
          </>
        )}
      </Show>

      <img src={micro} class="micro" alt=""/>
      <span class="made-by">made by KPI's students (2023)</span>
    </div>
  );
};


const Counter: Component<{ current: Accessor<number> }> = ({current}) => {
  return (
    <div class="counter">
      {current()}
    </div>
  );
};

function getLocalStream() {
  return navigator.mediaDevices
    .getUserMedia({video: false, audio: true})
    .then(() => {
      return true;
    })
    .catch((err) => {
      return false;
    });
}

const Loader: Component<{ text: Accessor<string> }> = ({text}) => {
  return (
    <>
      <div class="loader"/>
      <span class="loader__text">{text()}</span>
    </>
  );
};