"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { useCountDown, useDisclosure } from "@/hooks";
import { ARROW_KEYS, WASD_KEYS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { BadgeAlertIcon, CircleCheckBigIcon, Loader2Icon } from "lucide-react";
import { useRef, useState } from "react";

const TIME_OUT = 5; // in seconds

const checkSubmission = (board: BoardState[][], solution: number[][]) => {
  for (let rowIdx = 0; rowIdx < board.length; rowIdx++) {
    for (let cellIdx = 0; cellIdx < board[rowIdx].length; cellIdx++) {
      if (board[rowIdx][cellIdx].value !== solution[rowIdx][cellIdx]) {
        return false;
      }
    }
  }

  return true;
};

type Board = {
  newboard: {
    grids: {
      value: number[][];
      solution: number[][];
      difficulty: string;
    }[];
    results: number;
    message: string;
  };
};

type BoardState = {
  value: number;
  disabled: boolean;
};

export default function SudokuPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [isSubmissionCorrect, setIsSubmissionCorrect] = useState(false);
  const [board, setBoard] = useState(
    Array.from<BoardState[]>({ length: 9 }).fill(
      Array.from<BoardState>({ length: 9 }).fill({ value: 0, disabled: false })
    )
  );
  const [initialBoard, setInitialBoard] = useState(
    Array.from<BoardState[]>({ length: 9 }).fill(
      Array.from<BoardState>({ length: 9 }).fill({ value: 0, disabled: false })
    )
  );

  const emptyFields = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const boardRef = useRef<HTMLDivElement | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { timeLeft, startCountDown, resetCountDown } = useCountDown({
    timeOut: TIME_OUT,
  });

  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: ["sudoku-board"],
    queryFn: async () => {
      const { data } = await axios.get<any, AxiosResponse<Board>>(
        "https://sudoku-api.vercel.app/api/dosuku"
      );

      const sudokuBoard = data.newboard.grids[0].value.map(row =>
        row.map<BoardState>(val => ({ value: val, disabled: val !== 0 }))
      );

      setBoard(sudokuBoard);
      setInitialBoard(sudokuBoard);

      for (const row of data.newboard.grids[0].value) {
        for (const cell of row) {
          emptyFields.current += Number(cell === 0);
        }
      }

      console.log(data.newboard.grids[0].solution);

      return data;
    },
    enabled: false,
  });

  const startNewGame = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    onClose();
    setGameStarted(true);
    refetch();
    resetCountDown();
  };

  const resetGame = () => {
    setBoard(initialBoard);

    for (const row of initialBoard) {
      for (const cell of row) {
        emptyFields.current += Number(!cell.disabled);
      }
    }
  };

  const tryAgain = () => {
    resetGame();
    onClose();
  };

  const updateBoard = (rowIdx: number, cellIdx: number, newValue: string) => {
    const newCellValue = Number(newValue);

    if (isNaN(newCellValue) || newCellValue === 0) return;

    // calculate the number of empty fields
    if (!board[rowIdx][cellIdx].disabled) emptyFields.current--;

    // create a new board and update the respective cell
    const newBoard = board.map(row => [...row]);
    newBoard[rowIdx][cellIdx].value = Number(newValue[newValue.length - 1]);

    setBoard(newBoard);
  };

  const submitBoard = () => {
    if (data === undefined) return;

    const isCorrect = checkSubmission(board, data.newboard.grids[0].solution);

    setIsSubmissionCorrect(isCorrect);

    onOpen();

    if (!isCorrect) return;

    startCountDown();
    timeoutRef.current = setTimeout(() => {
      onClose();
      setGameStarted(false);
    }, TIME_OUT * 1000);
  };

  const navigateUsingKeys = (
    keyCode: string,
    rowIdx: number,
    cellIdx: number
  ) => {
    if (boardRef.current === null) return;

    let newRowIdx = 0,
      newCellIdx = 0;

    switch (keyCode) {
      case WASD_KEYS.UP:
      case ARROW_KEYS.UP:
        newRowIdx = rowIdx === 0 ? 8 : rowIdx - 1;
        newCellIdx = cellIdx;

        if (board[newRowIdx][newCellIdx].disabled) {
          navigateUsingKeys(keyCode, newRowIdx, newCellIdx);
          return;
        }

        (
          boardRef.current.children[newRowIdx].children[
            newCellIdx
          ] as HTMLInputElement
        ).focus();
        return;

      case WASD_KEYS.DOWN:
      case ARROW_KEYS.DOWN:
        newRowIdx = (rowIdx + 1) % 9;
        newCellIdx = cellIdx;

        if (board[newRowIdx][newCellIdx].disabled) {
          navigateUsingKeys(keyCode, newRowIdx, newCellIdx);
          return;
        }

        (
          boardRef.current.children[newRowIdx].children[
            newCellIdx
          ] as HTMLInputElement
        ).focus();
        return;

      case WASD_KEYS.LEFT:
      case ARROW_KEYS.LEFT:
        newRowIdx = rowIdx;
        newCellIdx = cellIdx === 0 ? 8 : cellIdx - 1;

        if (board[newRowIdx][newCellIdx].disabled) {
          navigateUsingKeys(keyCode, newRowIdx, newCellIdx);
          return;
        }

        (
          boardRef.current.children[newRowIdx].children[
            newCellIdx
          ] as HTMLInputElement
        ).focus();
        return;

      case WASD_KEYS.RIGHT:
      case ARROW_KEYS.RIGHT:
        newRowIdx = rowIdx;
        newCellIdx = (cellIdx + 1) % 9;

        if (board[newRowIdx][newCellIdx].disabled) {
          navigateUsingKeys(keyCode, newRowIdx, newCellIdx);
          return;
        }

        (
          boardRef.current.children[newRowIdx].children[
            newCellIdx
          ] as HTMLInputElement
        ).focus();
        return;

      default:
        return;
    }
  };

  return (
    <main>
      <section
        style={{ height: "calc(100svh - var(--header-height))" }}
        className="py-10"
      >
        {!gameStarted ? (
          <div className="h-full rounded bg-secondary-10 flex flex-col items-center justify-center gap-1 p-5">
            <h2 className="text-4xl font-heading font-medium">SUDOKU</h2>
            <h3 className="text-lg text-center">
              Set the difficulty and click on the start button to begin a new
              game of Sudoku.
            </h3>

            <button
              className="mt-8 bg-accent px-10 py-2 text-xl font-medium rounded hover:bg-accent-90 transition-colors"
              onClick={startNewGame}
            >
              Start
            </button>
          </div>
        ) : (
          <div className="h-full rounded flex flex-col items-center justify-center gap-5">
            {isLoading || isRefetching ? (
              <Loader2Icon className="size-20 animate-spin" />
            ) : data === undefined ? (
              <p className="text-xl text-red-600 font-heading font-semibold">
                OOPS! An unexpected error occurred. Please try again later.
              </p>
            ) : (
              <div className="flex flex-col items-center gap-8">
                {/* board */}
                <div
                  ref={boardRef}
                  className="w-full max-w-[30rem] aspect-square  ring-4 ring-secondary grid grid-rows-9 sm:text-2xl"
                >
                  {board.map((row, rowIdx) => (
                    <div key={`row-${rowIdx}`} className="grid grid-cols-9">
                      {row.map((cell, cellIdx) => (
                        <input
                          key={`row-${rowIdx}/cell-${cellIdx}`}
                          className={cn(
                            "size-full ring-[1px] ring-secondary bg-background text-text focus:outline-0 text-center cursor-default",
                            {
                              "cursor-pointer bg-text text-background caret-transparent focus-visible:bg-accent-80 focus-visible:text-text":
                                !initialBoard[rowIdx][cellIdx].disabled,
                              "border-l-2 border-secondary":
                                cellIdx !== 0 && cellIdx % 3 === 0,
                              "border-t-2 border-secondary":
                                rowIdx !== 0 && rowIdx % 3 === 0,
                            }
                          )}
                          value={cell.value || ""}
                          disabled={initialBoard[rowIdx][cellIdx].disabled}
                          onChange={e =>
                            updateBoard(rowIdx, cellIdx, e.target.value)
                          }
                          data-rowidx={rowIdx}
                          data-cellidx={cellIdx}
                          onKeyDown={e =>
                            navigateUsingKeys(e.code, rowIdx, cellIdx)
                          }
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-5">
                  <button
                    className="bg-green-700 px-5 xs:px-10 py-2 xs:text-xl font-medium rounded hover:bg-green-700/90 transition-colors"
                    onClick={() => refetch()}
                  >
                    New
                  </button>

                  <button
                    className="bg-orange-700 px-5 xs:px-10 py-2 xs:text-xl font-medium rounded hover:bg-orange-700/90 transition-colors"
                    onClick={resetGame}
                  >
                    Reset
                  </button>

                  <Dialog open={isOpen}>
                    <DialogTrigger asChild>
                      <button
                        // disabled={emptyFields.current !== 0}
                        className="bg-red-700 px-5 xs:px-10 py-2 xs:text-xl font-medium rounded hover:bg-red-700/90 transition-colors disabled:opacity-60 disabled:hover:bg-red-700"
                        onClick={submitBoard}
                      >
                        Submit
                      </button>
                    </DialogTrigger>

                    <DialogContent noCloseButton className="border-0">
                      <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>

                      <div className="my-8 flex flex-col items-center gap-5">
                        {isSubmissionCorrect ? (
                          <CircleCheckBigIcon
                            color="green"
                            className="size-40"
                          />
                        ) : (
                          <BadgeAlertIcon color="#be123c" className="size-40" />
                        )}

                        {isSubmissionCorrect && (
                          <p>
                            This game will automatically close in ({timeLeft}s)
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-5">
                        {!isSubmissionCorrect && (
                          <button
                            className="bg-orange-700 px-5 py-1.5 font-medium rounded-md hover:bg-orange-700/90 transition-colors"
                            onClick={tryAgain}
                          >
                            Try Again
                          </button>
                        )}

                        <button
                          className="bg-green-700 px-5 py-1.5 font-medium rounded-md hover:bg-green-700/90 transition-colors"
                          onClick={startNewGame}
                        >
                          New
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
