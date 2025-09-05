import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { toast } from 'sonner';
import Spin from '@/components/ui/Spin'

import { useParams } from "react-router-dom";

function Roadmap({ roadmap, techName }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState({});
  const courseId = useParams();

  useEffect(() => {
    const initialCompleted = {};
    roadmap.forEach((plan) => {
      if (plan.markDone) {
        initialCompleted[plan.day] = true;
      }
    });
    setCompleted(initialCompleted);
  }, [roadmap]);



  const  handleMarkDone = async (day) => {
    try {
      setIsLoading(true)
      const response = await fetch(`http://127.0.0.1:8000/api/roadmap/${courseId.techName}/complete-day`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ day })
      });

      if (!response.ok) {
        setIsLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setIsLoading(false);
      setCompleted(prev => ({ ...prev, [day]: true }));
      toast.success("Topic Marked Done");
      } catch (error) {
        toast.error(error)
        setIsLoading(false);
        setError(error);
      }
    };

    useEffect(() => {
      if (error) {
          toast.error("Something went wrong, please try again!");
        }
    }, [error]);
        
    useEffect(() => {
      if (isLoading) {
        <Spin />
      }
    }, [isLoading]);

  return (
    <div className="space-y-4 w-180 flex-col">
      <div className='text-center'>
        <h1 className='text-4xl text-bold text-accent'>{techName} Roadmap</h1>
      </div>
      {roadmap.map((plan) => (
        <div key={plan.day}>
          {Number(plan.day) % 7 === 1 && (
            <h2 className="text-3xl font-bold mt-6 mb-2">
              Week {Math.floor((Number(plan.day) - 1) / 7) + 1}
            </h2>
          )}

          <div className="p-4 border rounded-lg bg-background/50 hover:bg-accent/20 flex justify-between items-center">
            <div>
                <h3 className="font-semibold">
                Day {plan.day}: {plan.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
            </div>

            <div className="flex-col text-sm mb-2 text-right">
              <div className="flex gap-2">
                <a
                    href={plan.video}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Video
                </a>
                <a
                    href={plan.article}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Article
                </a>
              </div>
                {typeof plan.markDone !== "undefined" ? ( completed[plan.day] == true ? (
                <button
                  className="w-25 h-10 mt-2 px-3 py-1 bg-green-600 rounded-md"
                  disabled
                >
                  Done
                </button>
              ) : (
                <button
                  onClick={() => handleMarkDone(plan.day)}
                  className="w-25 h-10 mt-2 px-3 py-1 border hover:border-green-600 rounded-md "
                >
                  Mark Done
                </button>
              )): ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

Roadmap.propTypes = {
  roadmap: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      video: PropTypes.string.isRequired,
      article: PropTypes.string.isRequired,
      markDone: PropTypes.bool,
    })
  ).isRequired,
};

export default Roadmap;
