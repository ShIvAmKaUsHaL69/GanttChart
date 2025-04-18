import { useEffect, useRef } from 'react';
import Gantt from 'frappe-gantt';

const GanttChart = ({ tasks, onTasksChange, viewMode = 'Day', readOnly = false }) => {
  const ganttContainer = useRef(null);
  const ganttInstance = useRef(null);

  // Format tasks for Frappe Gantt
  const formatTasks = (tasks) => {
    return tasks.map(task => {
      // Ensure dates are valid
      let startDate = task.start_date;
      let endDate = task.end_date;
      
      // Handle date conversion
      if (startDate && typeof startDate === 'string') {
        // Ensure format is YYYY-MM-DD
        if (!startDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Try to convert to ISO format
          const date = new Date(startDate);
          startDate = date.toISOString().split('T')[0];
        }
      }
      
      if (endDate && typeof endDate === 'string') {
        // Ensure format is YYYY-MM-DD
        if (!endDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Try to convert to ISO format
          const date = new Date(endDate);
          endDate = date.toISOString().split('T')[0];
        }
      }
      
      return {
        id: task.id.toString(),
        name: task.name || `Task ${task.id}`, // Ensure name is not undefined
        start: startDate,
        end: endDate,
        progress: parseFloat(task.progress || 0),
        dependencies: task.dependencies || ''
      };
    });
  };

  // Initialize or update the Gantt chart
  useEffect(() => {
    if (!ganttContainer.current) {
      console.error('Gantt container ref is not available');
      return;
    }
    
    if (!tasks || tasks.length === 0) {
      console.log('No tasks available for Gantt chart');
      return;
    }
    
    try {
      const formattedTasks = formatTasks(tasks);
      
      // Validate formatted tasks
      const validTasks = formattedTasks.every(task => 
        task.id && 
        task.name && 
        task.start && 
        task.end && 
        typeof task.start === 'string' && 
        typeof task.end === 'string'
      );
      
      if (!validTasks) {
        console.error('Invalid task data for Gantt chart. All tasks must have valid properties and dates.');
        return;
      }
      
      // Clear the container first to prevent stacking issues
      if (ganttContainer.current) {
        ganttContainer.current.innerHTML = '';
      }
      
      // Set view mode
      const validViewMode = viewMode || 'Day';
      
      const options = {
        header_height: 50,
        column_width: 30,
        step: 24,
        view_mode: validViewMode,
        date_format: 'YYYY-MM-DD',
        bar_height: 24,
        bar_corner_radius: 3,
        arrow_curve: 5,
        padding: 14,
        on_date_change: (task, start, end) => {
          if (!readOnly && onTasksChange) {
            // Find the updated task
            const updatedTask = tasks.find(t => t.id.toString() === task.id);
            if (updatedTask) {
              // Update the task with new dates
              onTasksChange([
                ...tasks.filter(t => t.id.toString() !== task.id),
                {
                  ...updatedTask,
                  start_date: start.toISOString().split('T')[0],
                  end_date: end.toISOString().split('T')[0]
                }
              ]);
            }
          }
        },
        on_progress_change: (task, progress) => {
          if (!readOnly && onTasksChange) {
            // Find the updated task
            const updatedTask = tasks.find(t => t.id.toString() === task.id);
            if (updatedTask) {
              // Update the task with new progress
              onTasksChange([
                ...tasks.filter(t => t.id.toString() !== task.id),
                {
                  ...updatedTask,
                  progress
                }
              ]);
            }
          }
        },
        custom_popup_html: (task) => {
          // Make sure the task is defined before accessing properties
          if (!task) return '';
          
          // Custom popup content with safety checks
          return `
            <div class="gantt-popup">
              <h3>${task.name || ''}</h3>
              <p>
                <strong>Start:</strong> ${task.start || ''}<br>
                <strong>End:</strong> ${task.end || ''}<br>
                <strong>Progress:</strong> ${task.progress || 0}%
              </p>
            </div>
          `;
        },
        readonly: readOnly
      };
      
      try {
        // Initialize with the container element directly
        ganttInstance.current = new Gantt(
          ganttContainer.current,
          formattedTasks,
          options
        );
      } catch (error) {
        console.error('Error initializing Gantt chart:', error);
        
        // Try fallback with selector string
        try {
          ganttInstance.current = new Gantt(
            '.gantt-container',
            formattedTasks,
            options
          );
        } catch (fallbackError) {
          console.error('Fallback initialization also failed:', fallbackError);
        }
      }
    } catch (error) {
      console.error('Error in Gantt chart setup:', error);
    }
    
    // Cleanup on unmount
    return () => {
      ganttInstance.current = null;
    };
  }, [tasks, viewMode, readOnly, onTasksChange]);

  // Add a resize handler to adjust Gantt chart on window resize
  useEffect(() => {
    const handleResize = () => {
      if (ganttInstance.current) {
        // Give it a moment to calculate new dimensions
        setTimeout(() => {
          try {
            // Force the chart to re-render with the new container width
            ganttInstance.current.refresh(ganttInstance.current.tasks);
          } catch (error) {
            console.warn('Could not refresh Gantt chart on resize:', error);
          }
        }, 200);
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Render an empty div that will be used as the container for the Gantt chart
  return (
    <div className="gantt-wrapper">
      <div ref={ganttContainer} className="gantt-container"></div>
    </div>
  );
};

export default GanttChart; 