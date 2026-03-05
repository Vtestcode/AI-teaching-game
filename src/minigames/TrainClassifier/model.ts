import * as tf from "@tensorflow/tfjs";
import { Example, makeInput, labelToOneHot } from "./toyData";

export type TrainResult = {
  model: tf.LayersModel;
  history: { loss: number[]; acc: number[] };
};

export async function buildAndTrain(
  examples: Example[],
  epochs: number,
  onEpoch?: (epoch: number, logs: { loss?: number; acc?: number; accuracy?: number }) => void
): Promise<TrainResult> {
  if (examples.length < 6) {
    throw new Error("Add at least 6 examples so the AI can learn.");
  }

  const xs = tf.tensor2d(examples.map(makeInput));
  const ys = tf.tensor2d(examples.map((e) => labelToOneHot(e.label)));

  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [6],
      units: 12,
      activation: "relu"
    })
  );
  model.add(tf.layers.dense({ units: 8, activation: "relu" }));
  model.add(tf.layers.dense({ units: 2, activation: "softmax" }));

  model.compile({
    optimizer: tf.train.adam(0.03),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });

  const lossArr: number[] = [];
  const accArr: number[] = [];

  await model.fit(xs, ys, {
    epochs,
    shuffle: true,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        const acc = (logs?.acc ?? logs?.accuracy ?? 0) as number;
        const loss = (logs?.loss ?? 0) as number;
        lossArr.push(loss);
        accArr.push(acc);
        onEpoch?.(epoch + 1, logs ?? {});
        await tf.nextFrame();
      }
    }
  });

  xs.dispose();
  ys.dispose();

  return { model, history: { loss: lossArr, acc: accArr } };
}

export async function predict(model: tf.LayersModel, input: number[]) {
  const x = tf.tensor2d([input]);
  const y = model.predict(x) as tf.Tensor;
  const arr = Array.from(await y.data());
  x.dispose();
  y.dispose();
  return arr;
}