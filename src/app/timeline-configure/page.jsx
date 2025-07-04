'use client';
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

const COLORS = {
  background: "#f8fafd",
  card: "#fff",
  border: "#e0e7ef",
  primary: "#1db489",
  accent: "#0e7c7b",
  text: "#222",
  muted: "#6b7a8f",
  taskBar: "#1db489",
  taskBarHover: "#0e7c7b",
  gridLine: "#f0f0f0",
  success: "#28a745",
  warning: "#ffc107",
  error: "#dc3545",
};

const CONSTANTS = {
  MONTH_WIDTH: 60,
  TASK_HEIGHT: 32,
  HEADER_HEIGHT: 50,
  TASK_BAR_HEIGHT: 22,
  MIN_TASK_WIDTH: 15,
  AUTO_SAVE_DELAY: 2000,
  PANEL_WIDTH: 350,
};

// Common styles
const commonStyles = {
  input: {
    width: "100%",
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: "0.75rem",
    fontSize: "1rem",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
    color: COLORS.text,
    backgroundColor: COLORS.card,
  },
  button: {
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  card: {
    background: COLORS.background,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: "1.5rem",
  },
};

// Utility functions
const ensureDate = (date) => {
  if (date instanceof Date) return date;
  
  // Handle string dates from HTML inputs (YYYY-MM-DD format)
  if (typeof date === 'string') {
    // If it's already in YYYY-MM-DD format, parse it as local date
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Split the date string and create date in local timezone
      const [year, month, day] = date.split('-').map(Number);
      return new Date(year, month - 1, day); // month is 0-based in Date constructor
    }
    // Otherwise, use regular Date constructor
    return new Date(date);
  }
  
  return new Date(date);
};

const isValidDate = (date) => {
  const d = ensureDate(date);
  return !isNaN(d.getTime());
};

// Better date formatting for display
const formatDateForDisplay = (date) => {
  const d = ensureDate(date);
  if (!isValidDate(d)) return 'Invalid Date';
  
  // Use explicit formatting to avoid locale issues
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Custom hooks
const useMemoizedTasks = (tasks) => {
  return useMemo(() => {
    return tasks.map(task => ({
      ...task,
      start: ensureDate(task.start),
      end: ensureDate(task.end)
    }));
  }, [tasks]);
};

// Memoized month labels generator
const useMonthLabels = (startYear, endYear) => {
  return useMemo(() => {
    const labels = [];
    // Always start from January (month 0) of the startYear
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month, 1);
        labels.push({
          year,
          month,
          label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          shortLabel: date.toLocaleDateString('en-US', { month: 'short' })
        });
      }
    }
    
    return labels;
  }, [startYear, endYear]);
};

// TaskBar component - Remove debug styling and console logs
const TaskBar = React.memo(({ task, startYear, monthWidth, onMouseEvents }) => {
  const style = useMemo(() => {
    const startDate = ensureDate(task.start);
    const endDate = ensureDate(task.end);
    
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return { display: 'none' };
    }
    
    const startMonthIndex = (startDate.getFullYear() - startYear) * 12 + startDate.getMonth();
    const endMonthIndex = (endDate.getFullYear() - startYear) * 12 + endDate.getMonth();
    
    const startPosition = startMonthIndex * monthWidth;
    const endPosition = (endMonthIndex + 1) * monthWidth;
    const width = Math.max(endPosition - startPosition, CONSTANTS.MIN_TASK_WIDTH);
    
    return {
      left: `${startPosition}px`,
      width: `${width}px`,
      backgroundColor: COLORS.taskBar,
      height: `${CONSTANTS.TASK_BAR_HEIGHT}px`,
      borderRadius: '3px', // Reduced from 4px
      position: 'absolute',
      top: '5px', // Adjusted for compact layout
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '6px', // Reduced from 8px
      color: 'white',
      fontSize: '11px', // Reduced from 12px
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      zIndex: 100,
      margin: 0,
      padding: 0,
    };
  }, [task, startYear, monthWidth]);

  const handleMouseEnter = useCallback((e) => {
    Object.assign(e.target.style, {
      backgroundColor: COLORS.taskBarHover,
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    });
  }, []);

  const handleMouseLeave = useCallback((e) => {
    Object.assign(e.target.style, {
      backgroundColor: COLORS.taskBar,
      transform: 'translateY(0)',
      boxShadow: 'none',
    });
  }, []);

  if (style.display === 'none') return null;

  return (
    <div
      style={style}
      title={`${task.text}: ${formatDateForDisplay(task.start)} - ${formatDateForDisplay(task.end)}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {task.text}
    </div>
  );
});

TaskBar.displayName = 'TaskBar';

// TaskRow component - Remove debug elements and fix positioning
const TaskRow = React.memo(({ task, index, monthLabels, startYear, monthWidth, taskHeight }) => {
  return (
    <div
      style={{
        display: 'flex',
        height: `${taskHeight}px`,
        borderBottom: `1px solid ${COLORS.gridLine}`,
        backgroundColor: index % 2 === 0 ? COLORS.card : COLORS.background,
        margin: 0,
        padding: 0,
      }}
    >
      <div style={{
        width: '160px', // Reduced from 200px
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '8px', // Reduced from 12px
        fontSize: '12px', // Reduced from 14px
        fontWeight: '500',
        color: COLORS.text,
        borderRight: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.card,
        margin: 0,
      }}>
        {task.text}
      </div>
      
      <div style={{ 
        width: `${monthLabels.length * monthWidth}px`, // Explicit width instead of flex: 1
        position: 'relative', 
        height: '100%',
        overflow: 'visible',
        margin: 0,
        padding: 0,
        border: 'none',
        flexShrink: 0,
      }}>
        {monthLabels.map((month, monthIndex) => (
          <div
            key={monthIndex}
            style={{
              position: 'absolute',
              left: `${monthIndex * monthWidth}px`,
              top: 0,
              bottom: 0,
              width: '1px',
              backgroundColor: COLORS.gridLine,
              margin: 0,
              padding: 0,
            }}
          />
        ))}
        
        <TaskBar
          task={task}
          startYear={startYear}
          monthWidth={monthWidth}
        />
      </div>
    </div>
  );
});

TaskRow.displayName = 'TaskRow';

// GanttHeader component
const GanttHeader = React.memo(({ startYear, endYear, monthLabels, monthWidth, timelineWidth }) => {
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backgroundColor: COLORS.card,
      borderBottom: `2px solid ${COLORS.border}`,
      width: `${timelineWidth + 160}px`, // Reduced from 200px
      minWidth: '100%',
    }}>
      <div style={{
        display: 'flex',
        height: '24px', // Reduced from 30px
        backgroundColor: COLORS.background,
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ width: '160px', flexShrink: 0 }}></div>
        {Array.from({ length: endYear - startYear + 1 }, (_, i) => {
          const year = startYear + i;
          return (
            <div
              key={year}
              style={{
                width: `${monthWidth * 12}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '13px', // Reduced from 14px
                color: COLORS.primary,
                borderRight: `1px solid ${COLORS.border}`,
                backgroundColor: COLORS.card,
                flexShrink: 0,
              }}
            >
              {year}
            </div>
          );
        })}
      </div>
      
      <div style={{ display: 'flex', height: '24px', backgroundColor: COLORS.card }}> {/* Reduced from 30px */}
        <div style={{ 
          width: '160px', // Reduced from 200px
          flexShrink: 0, 
          display: 'flex', 
          alignItems: 'center',
          paddingLeft: '8px', // Reduced from 12px
          fontWeight: 'bold',
          fontSize: '12px', // Reduced from 14px
          color: COLORS.text,
          borderRight: `1px solid ${COLORS.border}`,
        }}>
          Task Name
        </div>
        {monthLabels.map((month, index) => (
          <div
            key={index}
            style={{
              width: `${monthWidth}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px', // Reduced from 11px
              color: COLORS.muted,
              borderRight: `1px solid ${COLORS.gridLine}`,
              backgroundColor: COLORS.card,
              flexShrink: 0,
            }}
          >
            {month.shortLabel}
          </div>
        ))}
      </div>
    </div>
  );
});

GanttHeader.displayName = 'GanttHeader';

// CustomGanttChart component
const CustomGanttChart = React.memo(({ tasks, startYear, endYear }) => {
  const monthLabels = useMonthLabels(startYear, endYear);
  const monthWidth = 50;
  const timelineWidth = monthLabels.length * monthWidth;
  const taskHeight = 40;

  return (
    <div style={{
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      backgroundColor: COLORS.card,
      overflow: 'hidden',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <div style={{ overflow: 'auto', maxHeight: '400px' }}>
        <GanttHeader
          startYear={startYear}
          endYear={endYear}
          monthLabels={monthLabels}
          monthWidth={monthWidth}
          timelineWidth={timelineWidth}
        />
        
        <div style={{ 
          minWidth: `${timelineWidth + 160}px`,
          backgroundColor: COLORS.background,
        }}>
          {tasks.map((task, index) => (
            <TaskRow
              key={task.id}
              task={task}
              index={index}
              monthLabels={monthLabels}
              startYear={startYear}
              monthWidth={monthWidth}
              taskHeight={taskHeight}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

CustomGanttChart.displayName = 'CustomGanttChart';

// InputField component
const InputField = React.memo(({ label, value, onChange, placeholder, type = 'text', required = false }) => {
  return (
    <div>
      <label style={{
        display: "block",
        color: COLORS.text,
        fontWeight: 500,
        marginBottom: "0.5rem",
        fontSize: "0.9rem",
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          ...commonStyles.input,
          width: "100%",
        }}
        onFocus={(e) => e.target.style.borderColor = COLORS.primary}
        onBlur={(e) => e.target.style.borderColor = COLORS.border}
      />
    </div>
  );
});

InputField.displayName = 'InputField';

// TaskItem component
const TaskItem = React.memo(({ task, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        marginBottom: '0.5rem',
        transition: 'all 0.2s ease',
        boxShadow: isHovered ? '0 2px 8px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ flex: 1 }}>
        <div style={{
          fontWeight: 500,
          fontSize: '1rem',
          color: COLORS.text,
          marginBottom: '0.25rem',
        }}>
          {task.text}
        </div>
        <div style={{
          fontSize: '0.85rem',
          color: COLORS.muted,
        }}>
          {formatDateForDisplay(task.start)} → {formatDateForDisplay(task.end)}
        </div>
      </div>
      
      <button
        onClick={() => onRemove(task.id)}
        style={{
          background: 'none',
          border: 'none',
          color: COLORS.error,
          cursor: 'pointer',
          fontSize: '1.2rem',
          padding: '0.5rem',
          borderRadius: 4,
          transition: 'all 0.2s ease',
          backgroundColor: isHovered ? `${COLORS.error}10` : 'transparent',
        }}
        title="Remove task"
      >
        ✕
      </button>
    </div>
  );
});

TaskItem.displayName = 'TaskItem';

// Notification component
const Notification = React.memo(({ notification }) => {
  const getNotificationStyles = useCallback(() => {
    if (!notification) return {};
    
    const baseStyles = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '1rem 1.5rem',
      borderRadius: 8,
      fontSize: '0.9rem',
      fontWeight: 500,
      zIndex: 2000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transition: 'all 0.3s ease',
      border: '1px solid',
    };

    switch (notification.type) {
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: COLORS.success,
          color: 'white',
          borderColor: COLORS.success,
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: COLORS.error,
          color: 'white',
          borderColor: COLORS.error,
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: COLORS.warning,
          color: 'white',
          borderColor: COLORS.warning,
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: COLORS.primary,
          color: 'white',
          borderColor: COLORS.primary,
        };
    }
  }, [notification]);

  if (!notification) return null;

  return (
    <div style={getNotificationStyles()}>
      {notification.message}
    </div>
  );
});

Notification.displayName = 'Notification';

// NewTimelineModal component
const NewTimelineModal = React.memo(({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  setTitle, 
  description, 
  setDescription 
}) => {
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }
    onSubmit();
  }, [title, onSubmit]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  }, [onClose, handleSubmit]);

  useEffect(() => {
    if (!isOpen) return;
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: '2rem',
        width: '90%',
        maxWidth: '500px',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{
            color: COLORS.primary,
            fontWeight: 700,
            fontSize: '1.5rem',
            margin: 0,
          }}>
            Create New Timeline
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: COLORS.muted,
              padding: '0.5rem',
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <InputField
              label="Timeline Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter timeline title (e.g., Website Development Project)"
              required
            />

            <div>
              <label style={{
                display: "block",
                color: COLORS.text,
                fontWeight: 500,
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
              }}>
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter timeline description"
                rows={3}
                style={{
                  ...commonStyles.input,
                  resize: "vertical",
                  minHeight: "80px",
                }}
                onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                onBlur={(e) => e.target.style.borderColor = COLORS.border}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1rem',
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  ...commonStyles.button,
                  background: COLORS.muted,
                  color: "#fff",
                  padding: "0.75rem 1.5rem",
                  flex: 1,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                style={{
                  ...commonStyles.button,
                  background: title.trim() ? COLORS.primary : COLORS.muted,
                  color: "#fff",
                  padding: "0.75rem 1.5rem",
                  flex: 1,
                }}
              >
                Create Timeline
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

NewTimelineModal.displayName = 'NewTimelineModal';

// TimelineSelector component
const TimelineSelector = React.memo(({ 
  isOpen, 
  onClose, 
  timelines, 
  currentTimelineId, 
  onSelect,
  onDelete,
  onDuplicate,
  onCleanup,
  onRename,
  legacyCount,
  isLoading 
}) => {
  const formatDate = useCallback((dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: '2rem',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '80vh',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{
            color: COLORS.primary,
            fontWeight: 700,
            fontSize: '1.5rem',
            margin: 0,
          }}>
            Select Timeline
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: COLORS.muted,
              padding: '0.5rem',
            }}
          >
            ✕
          </button>
        </div>

        {legacyCount > 0 && (
          <div style={{
            backgroundColor: `${COLORS.warning}15`,
            border: `1px solid ${COLORS.warning}40`,
            borderRadius: 8,
            padding: '1rem',
            marginBottom: '1rem',
          }}>
            <h4 style={{
              color: COLORS.warning,
              margin: '0 0 0.5rem 0',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}>
              ⚠️ Legacy Timelines Found
            </h4>
            <p style={{
              fontSize: '0.8rem',
              color: COLORS.muted,
              marginBottom: '0.75rem',
            }}>
              Found {legacyCount} old timelines named &quot;My Timeline&quot;. Clean them up?
            </p>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={onCleanup}
                style={{
                  background: COLORS.error,
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                🗑️ Delete Empty Ones
              </button>
              <button
                onClick={onRename}
                style={{
                  background: COLORS.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                🏷️ Rename All
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: COLORS.muted,
          }}>
            Loading timelines...
          </div>
        ) : timelines.length === 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: COLORS.muted,
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div style={{ fontSize: '3rem', opacity: 0.3 }}>📅</div>
            <div>No timelines found. Create your first timeline!</div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {timelines.map((timeline) => (
              <div
                key={timeline._id}
                style={{
                  border: `2px solid ${timeline._id === currentTimelineId ? COLORS.primary : COLORS.border}`,
                  borderRadius: 12,
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: timeline._id === currentTimelineId ? `${COLORS.primary}10` : COLORS.card,
                  opacity: timeline.title === "My Timeline" ? 0.7 : 1,
                }}
                onClick={() => onSelect(timeline._id)}
                onMouseEnter={(e) => {
                  if (timeline._id !== currentTimelineId) {
                    e.currentTarget.style.borderColor = COLORS.primary;
                    e.currentTarget.style.backgroundColor = `${COLORS.primary}05`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (timeline._id !== currentTimelineId) {
                    e.currentTarget.style.borderColor = COLORS.border;
                    e.currentTarget.style.backgroundColor = COLORS.card;
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                  <div style={{ flex: 1, marginRight: '1rem' }}>
                    <div style={{
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      color: COLORS.text,
                      marginBottom: '0.5rem',
                    }}>
                      {timeline.title}
                      {timeline.title === "My Timeline" && (
                        <span style={{
                          marginLeft: '0.5rem',
                          fontSize: '0.7rem',
                          color: COLORS.warning,
                          fontWeight: 500,
                          backgroundColor: `${COLORS.warning}20`,
                          padding: '0.2rem 0.4rem',
                          borderRadius: 4,
                        }}>
                          Legacy
                        </span>
                      )}
                      {timeline._id === currentTimelineId && (
                        <span style={{
                          marginLeft: '0.5rem',
                          fontSize: '0.8rem',
                          color: COLORS.primary,
                          fontWeight: 500,
                        }}>
                          (Current)
                        </span>
                      )}
                    </div>
                    
                    {timeline.description && (
                      <div style={{
                        color: COLORS.muted,
                        fontSize: '0.9rem',
                        marginBottom: '0.5rem',
                      }}>
                        {timeline.description}
                      </div>
                    )}
                    
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.8rem',
                      color: COLORS.muted,
                    }}>
                      <span>
                        {timeline.startYear} - {timeline.endYear}
                      </span>
                      <span>
                        {timeline.tasks?.length || 0} tasks
                      </span>
                      <span>
                        Updated: {formatDate(timeline.updatedAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate(timeline._id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: COLORS.primary,
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        padding: '0.5rem',
                        borderRadius: 4,
                        transition: 'all 0.2s',
                      }}
                      title="Duplicate timeline"
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = `${COLORS.primary}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      📋
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(timeline._id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: COLORS.error,
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        padding: '0.5rem',
                        borderRadius: 4,
                        transition: 'all 0.2s',
                      }}
                      title="Delete timeline"
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = `${COLORS.error}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

TimelineSelector.displayName = 'TimelineSelector';

// Main component
export default function TimelineConfigurePage() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskStart, setNewTaskStart] = useState("");
  const [newTaskEnd, setNewTaskEnd] = useState("");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isClient, setIsClient] = useState(false);
  const [taskIdCounter, setTaskIdCounter] = useState(1);
  
  // Generate initial timeline name with current date
  const getInitialTimelineName = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    return `Timeline ${dateStr}`;
  };
  
  const [timelineTitle, setTimelineTitle] = useState(getInitialTimelineName());
  const [timelineDescription, setTimelineDescription] = useState("");
  const [currentTimelineId, setCurrentTimelineId] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved'); // Start as saved to prevent auto-save on empty timeline
  const [lastSaved, setLastSaved] = useState(null);
  const [availableTimelines, setAvailableTimelines] = useState([]);
  const [isLoadingTimelines, setIsLoadingTimelines] = useState(false);
  const [showTimelineSelector, setShowTimelineSelector] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [notification, setNotification] = useState(null);
  const [hasUserDismissedSelector, setHasUserDismissedSelector] = useState(false);
  const [hasUserMadeChanges, setHasUserMadeChanges] = useState(false);
  const [showNewTimelineModal, setShowNewTimelineModal] = useState(false);
  const [newTimelineTitle, setNewTimelineTitle] = useState("");
  const [newTimelineDescription, setNewTimelineDescription] = useState("");
  const [legacyCount, setLegacyCount] = useState(0);
  const [showLegacyWarning, setShowLegacyWarning] = useState(false);

  // Add CSS animation for pulse effect
  useEffect(() => {
    if (!document.getElementById('timeline-animations')) {
      const style = document.createElement('style');
      style.id = 'timeline-animations';
      style.textContent = `
        @keyframes pulse-timeline {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .pulse-timeline {
          animation: pulse-timeline 2s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Smart timeline name generator
  const generateSmartTimelineName = useCallback((baseName = '', includeTime = true) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    if (includeTime) {
      const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      return baseName ? `${baseName} ${dateStr} ${timeStr}` : `Timeline ${dateStr} ${timeStr}`;
    }
    
    return baseName ? `${baseName} ${dateStr}` : `Timeline ${dateStr}`;
  }, []);

  // Generate project name suggestions based on task content

  // Memoized processed tasks
  const processedTasks = useMemoizedTasks(tasks);

  // Timeline years
  const startYear = currentYear;
  const endYear = currentYear + 3;

  // Initialize client-side values and load available timelines
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    setIsClient(true);
    setHasUserMadeChanges(false); // Start with no changes
    loadAvailableTimelines(true); // Pass true for initial load
  }, []);

  // Prevent accidental page close with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (saveStatus === 'unsaved') {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveStatus]);

  // Show notification helper
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Database Management Functions
  const loadAvailableTimelines = useCallback(async (isInitialLoad = false) => {
    setIsLoadingTimelines(true);
    try {
      const response = await fetch('/api/timelines');
      const result = await response.json();
      
      if (result.success) {
        setAvailableTimelines(result.data || []);
        
        // Only auto-show selector on initial load and if user hasn't dismissed it
        if (isInitialLoad && !hasUserDismissedSelector && !currentTimelineId && result.data && result.data.length > 0) {
          setShowTimelineSelector(true);
        }
      } else {
        console.error('Error loading timelines:', result.error);
      }
    } catch (error) {
      console.error('Error loading timelines:', error);
    } finally {
      setIsLoadingTimelines(false);
    }
  }, [currentTimelineId, hasUserDismissedSelector]);

  // Bulk cleanup for old timelines
  const cleanupOldTimelines = useCallback(async () => {
    const oldTimelines = availableTimelines.filter(timeline => 
      timeline.title === "My Timeline" && timeline.tasks.length === 0
    );
    
    if (oldTimelines.length === 0) {
      showNotification('No empty legacy timelines to clean up');
      return;
    }
    
    const confirmCleanup = window.confirm(
      `Found ${oldTimelines.length} empty legacy timelines named &quot;My Timeline&quot;. Delete them all?`
    );
    
    if (!confirmCleanup) return;
    
    try {
      const deletePromises = oldTimelines.map(timeline => 
        fetch(`/api/timelines/${timeline._id}`, { method: 'DELETE' })
      );
      
      await Promise.all(deletePromises);
      
      // Refresh the timeline list
      await loadAvailableTimelines();
      
      showNotification(`Cleaned up ${oldTimelines.length} legacy timelines`);
    } catch (error) {
      console.error('Error cleaning up timelines:', error);
      showNotification('Failed to cleanup timelines', 'error');
    }
  }, [availableTimelines, loadAvailableTimelines, showNotification]);

  // Bulk rename legacy timelines
  const renameLegacyTimelines = useCallback(async () => {
    const legacyTimelines = availableTimelines.filter(timeline => 
      timeline.title === "My Timeline"
    );
    
    if (legacyTimelines.length === 0) {
      showNotification('No legacy timelines to rename');
      return;
    }
    
    const confirmRename = window.confirm(
      `Found ${legacyTimelines.length} legacy timelines named &quot;My Timeline&quot;. Rename them with unique names?`
    );
    
    if (!confirmRename) return;
    
    try {
      const renamePromises = legacyTimelines.map(async (timeline, index) => {
        const newName = `Timeline ${new Date(timeline.createdAt).getFullYear()}-${String(timeline.createdAt.slice(5, 7)).padStart(2, '0')}-${String(timeline.createdAt.slice(8, 10)).padStart(2, '0')}`;
        
        return fetch(`/api/timelines/${timeline._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...timeline,
            title: newName
          })
        });
      });
      
      await Promise.all(renamePromises);
      
      // Refresh the timeline list
      await loadAvailableTimelines();
      
      showNotification(`Renamed ${legacyTimelines.length} legacy timelines`);
    } catch (error) {
      console.error('Error renaming timelines:', error);
      showNotification('Failed to rename timelines', 'error');
    }
  }, [availableTimelines, loadAvailableTimelines, showNotification]);

  const loadTimeline = useCallback(async (timelineId) => {
    if (!timelineId) return;
    
    setSaveStatus('loading');
    try {
      const response = await fetch(`/api/timelines/${timelineId}`);
      const result = await response.json();
      
      if (result.success) {
        const timeline = result.data;
        setCurrentTimelineId(timeline._id);
        setTimelineTitle(timeline.title);
        setTimelineDescription(timeline.description || '');
        setCurrentYear(timeline.startYear);
        
        // Process tasks to ensure proper date handling
        const processedTasks = timeline.tasks.map(task => ({
          ...task,
          start: ensureDate(task.start),
          end: ensureDate(task.end)
        }));
        
        setTasks(processedTasks);
        
        // Update task ID counter based on existing tasks
        const maxId = processedTasks.reduce((max, task) => Math.max(max, task.id), 0);
        setTaskIdCounter(maxId + 1);
        
        setSaveStatus('saved');
        setLastSaved(new Date(timeline.updatedAt));
        setShowTimelineSelector(false);
        setHasUserMadeChanges(false); // Reset changes flag for loaded timeline
        showNotification(`Timeline "${timeline.title}" loaded successfully`);
      } else {
        throw new Error(result.error || 'Failed to load timeline');
      }
    } catch (error) {
      console.error('Error loading timeline:', error);
      setSaveStatus('error');
      showNotification('Failed to load timeline. Please try again.', 'error');
    }
  }, [showNotification]);

  const createNewTimeline = useCallback(async (title, description = "") => {
    setIsCreatingNew(true);
    
    setCurrentTimelineId(null);
    setTimelineTitle(title || generateSmartTimelineName());
    setTimelineDescription(description);
    setTasks([]);
    setTaskIdCounter(1);
    setSaveStatus('saving'); // Set to saving since we'll save immediately
    setShowTimelineSelector(false);
    setShowNewTimelineModal(false);
    setIsCreatingNew(false);
    setHasUserMadeChanges(true); // Mark as changed since user explicitly created it
    
    // Clear modal form
    setNewTimelineTitle("");
    setNewTimelineDescription("");
    
    // Immediately save the new timeline to database
    try {
      const timelineData = {
        title: title || generateSmartTimelineName(),
        description: description,
        startYear: currentYear,
        endYear: currentYear + 3,
        tasks: [],
        userId: null,
        userEmail: null
      };

      const response = await fetch('/api/timelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timelineData),
      });

      const result = await response.json();

      if (result.success) {
        setCurrentTimelineId(result.data._id);
        setSaveStatus('saved');
        setLastSaved(new Date());
        
        // Refresh available timelines to include the new one
        await loadAvailableTimelines();
        
        showNotification(`Timeline "${title}" created and saved successfully`);
      } else {
        throw new Error(result.error || 'Failed to create timeline');
      }
    } catch (error) {
      console.error('Error creating timeline:', error);
      setSaveStatus('error');
      showNotification('Failed to create timeline. Please try again.', 'error');
    }
  }, [generateSmartTimelineName, showNotification, currentYear, loadAvailableTimelines]);

  const duplicateTimeline = useCallback(async (timelineId) => {
    if (!timelineId) return;
    
    try {
      const response = await fetch(`/api/timelines/${timelineId}`);
      const result = await response.json();
      
      if (result.success) {
        const originalTimeline = result.data;
        
        // Generate a unique name for the duplicated timeline
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        const uniqueName = `${originalTimeline.title} (Copy ${timeStr})`;
        
        setCurrentTimelineId(null);
        setTimelineTitle(uniqueName);
        setTimelineDescription(originalTimeline.description || '');
        setCurrentYear(originalTimeline.startYear);
        
        // Process tasks to ensure proper date handling
        const processedTasks = originalTimeline.tasks.map(task => ({
          ...task,
          start: ensureDate(task.start),
          end: ensureDate(task.end)
        }));
        
        setTasks(processedTasks);
        
        // Update task ID counter based on existing tasks
        const maxId = processedTasks.reduce((max, task) => Math.max(max, task.id), 0);
        setTaskIdCounter(maxId + 1);
        
        setSaveStatus('unsaved');
        setShowTimelineSelector(false);
        setHasUserMadeChanges(true); // Mark as changed since it's a duplicate that needs saving
        showNotification('Timeline duplicated successfully');
      } else {
        throw new Error(result.error || 'Failed to duplicate timeline');
      }
    } catch (error) {
      console.error('Error duplicating timeline:', error);
      showNotification('Failed to duplicate timeline', 'error');
    }
  }, [showNotification]);

  const deleteTimeline = useCallback(async (timelineId) => {
    if (!timelineId) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete this timeline? This action cannot be undone.');
    if (!confirmDelete) return;
    
    try {
      const response = await fetch(`/api/timelines/${timelineId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.success) {
        // Refresh available timelines
        await loadAvailableTimelines();
        
        // If we deleted the current timeline, reset to new timeline
        if (timelineId === currentTimelineId) {
          createNewTimeline();
        }
        
        showNotification('Timeline deleted successfully');
      } else {
        throw new Error(result.error || 'Failed to delete timeline');
      }
    } catch (error) {
      console.error('Error deleting timeline:', error);
      showNotification('Failed to delete timeline. Please try again.', 'error');
    }
  }, [currentTimelineId, loadAvailableTimelines, createNewTimeline, showNotification]);

  // Enhanced save function with better error handling
  const saveTimeline = useCallback(async (isAutoSave = false) => {
    // Prevent auto-save from creating new timelines if user hasn't made meaningful changes
    if (isAutoSave && !currentTimelineId && !hasUserMadeChanges) {
      console.log('Skipping auto-save: No user changes detected');
      return;
    }

    // Prevent saving empty timelines (no tasks and default title)
    if (!currentTimelineId && tasks.length === 0 && timelineTitle.startsWith('Timeline ')) {
      if (isAutoSave) {
        console.log('Skipping auto-save: Empty timeline with default title');
        return;
      } else {
        showNotification('Cannot save empty timeline. Please add tasks first.', 'warning');
        return;
      }
    }

    if (!isAutoSave) setSaveStatus('saving');

    try {
      const timelineData = {
        title: timelineTitle,
        description: timelineDescription,
        startYear,
        endYear,
        tasks: processedTasks,
        userId: null,
        userEmail: null
      };

      const response = await fetch(
        currentTimelineId ? `/api/timelines/${currentTimelineId}` : '/api/timelines',
        {
          method: currentTimelineId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(timelineData),
        }
      );

      const result = await response.json();

      if (result.success) {
        if (!currentTimelineId && result.data._id) {
          setCurrentTimelineId(result.data._id);
          // Refresh available timelines to include the new one
          await loadAvailableTimelines();
        }
        setSaveStatus('saved');
        setLastSaved(new Date());
        
        if (!isAutoSave) {
          showNotification('Timeline saved successfully');
          setTimeout(() => setSaveStatus('saved'), 2000);
        }
      } else {
        throw new Error(result.error || 'Failed to save timeline');
      }
    } catch (error) {
      console.error('Error saving timeline:', error);
      setSaveStatus('error');
      if (!isAutoSave) {
        showNotification('Failed to save timeline. Please try again.', 'error');
      }
    }
  }, [timelineTitle, timelineDescription, startYear, endYear, processedTasks, currentTimelineId, loadAvailableTimelines, showNotification, hasUserMadeChanges, tasks.length]);

  // Auto-save functionality - Only auto-save when there are meaningful changes
  const shouldAutoSave = hasUserMadeChanges && (tasks.length > 0 || currentTimelineId);

  // Custom auto-save implementation with intelligent conditions
  useEffect(() => {
    if (!shouldAutoSave) return;
    
    const timer = setTimeout(() => {
      if (saveStatus === 'unsaved' && hasUserMadeChanges) {
        saveTimeline(true);
      }
    }, CONSTANTS.AUTO_SAVE_DELAY);
    
    return () => clearTimeout(timer);
  }, [processedTasks, timelineTitle, timelineDescription, isClient, shouldAutoSave, saveStatus, hasUserMadeChanges, saveTimeline]);

  // Enhanced task management with immediate database sync
  const addTask = useCallback(async () => {
    if (!newTaskName.trim() || !newTaskStart || !newTaskEnd) {
      showNotification("Please fill in all fields", 'warning');
      return;
    }

    const startDate = new Date(newTaskStart);
    const endDate = new Date(newTaskEnd);
    
    if (startDate >= endDate) {
      showNotification("End date must be after start date", 'warning');
      return;
    }

    const newTask = {
      id: taskIdCounter,
      text: newTaskName,
      start: startDate,
      end: endDate,
      duration: Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)),
    };

    // Update state first
    setTasks(prev => [...prev, newTask]);
    setTaskIdCounter(prev => prev + 1);
    setSaveStatus('saving');
    setHasUserMadeChanges(true); // Mark that user has made meaningful changes
    

    
    // Clear form immediately for better UX
    setNewTaskName("");
    setNewTaskStart("");
    setNewTaskEnd("");
    
    // Immediately save the updated timeline with the new task
    try {
      const updatedTasks = [...tasks, newTask];
      const timelineData = {
        title: timelineTitle,
        description: timelineDescription,
        startYear,
        endYear,
        tasks: updatedTasks,
        userId: null,
        userEmail: null
      };

      const response = await fetch(
        currentTimelineId ? `/api/timelines/${currentTimelineId}` : '/api/timelines',
        {
          method: currentTimelineId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(timelineData),
        }
      );

      const result = await response.json();

      if (result.success) {
        if (!currentTimelineId && result.data._id) {
          setCurrentTimelineId(result.data._id);
          // Refresh available timelines to include the new one
          await loadAvailableTimelines();
        }
        setSaveStatus('saved');
        setLastSaved(new Date());
        
        if (false) {
          showNotification(`Task "${newTaskName}" added and timeline renamed to "${timelineTitle}"`);
        } else {
          showNotification(`Task "${newTaskName}" added and saved successfully`);
        }
      } else {
        throw new Error(result.error || 'Failed to save task');
      }
    } catch (error) {
      console.error('Error saving task:', error);
      setSaveStatus('error');
      showNotification('Task added but failed to save. Please try saving manually.', 'error');
    }
  }, [newTaskName, newTaskStart, newTaskEnd, taskIdCounter, timelineTitle, timelineDescription, startYear, endYear, tasks, currentTimelineId, loadAvailableTimelines, showNotification]);

  const removeTask = useCallback(async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const confirmDelete = window.confirm(`Are you sure you want to remove "${task?.text}" task?`);
    if (!confirmDelete) return;
    
    // Update state first
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setSaveStatus('saving');
    setHasUserMadeChanges(true); // Mark that user has made changes
    
    // Immediately save the updated timeline with the task removed
    try {
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      const timelineData = {
        title: timelineTitle,
        description: timelineDescription,
        startYear,
        endYear,
        tasks: updatedTasks,
        userId: null,
        userEmail: null
      };

      const response = await fetch(
        currentTimelineId ? `/api/timelines/${currentTimelineId}` : '/api/timelines',
        {
          method: currentTimelineId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(timelineData),
        }
      );

      const result = await response.json();

      if (result.success) {
        if (!currentTimelineId && result.data._id) {
          setCurrentTimelineId(result.data._id);
          await loadAvailableTimelines();
        }
        setSaveStatus('saved');
        setLastSaved(new Date());
        showNotification(`Task "${task?.text}" removed and saved successfully`);
      } else {
        throw new Error(result.error || 'Failed to save after removing task');
      }
    } catch (error) {
      console.error('Error saving after task removal:', error);
      setSaveStatus('error');
      showNotification('Task removed but failed to save. Please try saving manually.', 'error');
    }
  }, [tasks, timelineTitle, timelineDescription, startYear, endYear, currentTimelineId, loadAvailableTimelines, showNotification]);

  // Event handlers
  const handleTitleChange = useCallback((e) => {
    setTimelineTitle(e.target.value);
    setSaveStatus('unsaved');
    setHasUserMadeChanges(true); // Mark that user has made changes
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    setTimelineDescription(e.target.value);
    setSaveStatus('unsaved');
    setHasUserMadeChanges(true); // Mark that user has made changes
  }, []);

  // Timeline management handlers
  const handleCreateNewTimeline = useCallback(() => {
    // Check if there are unsaved changes
    if (saveStatus === 'unsaved') {
      const confirmNew = window.confirm('You have unsaved changes. Are you sure you want to create a new timeline? Unsaved changes will be lost.');
      if (!confirmNew) return;
    }
    
    // Show the new timeline modal instead of directly creating
    setShowNewTimelineModal(true);
    setNewTimelineTitle(""); // Clear previous inputs
    setNewTimelineDescription("");
  }, [saveStatus]);

  const handleCreateNewTimelineSubmit = useCallback(() => {
    if (!newTimelineTitle.trim()) {
      showNotification("Please enter a timeline title", 'warning');
      return;
    }
    
    createNewTimeline(newTimelineTitle.trim(), newTimelineDescription.trim());
    setHasUserDismissedSelector(false); // Reset dismissal flag when creating new
  }, [newTimelineTitle, newTimelineDescription, createNewTimeline, showNotification]);

  const handleCancelNewTimeline = useCallback(() => {
    setShowNewTimelineModal(false);
    setNewTimelineTitle("");
    setNewTimelineDescription("");
  }, []);

  const handleLoadTimeline = useCallback(() => {
    // Check if there are unsaved changes
    if (saveStatus === 'unsaved') {
      const confirmLoad = window.confirm('You have unsaved changes. Are you sure you want to load another timeline? Unsaved changes will be lost.');
      if (!confirmLoad) return;
    }
    
    // Refresh available timelines and show selector
    loadAvailableTimelines();
    setShowTimelineSelector(true);
    setHasUserDismissedSelector(false); // Reset dismissal flag when manually opening
  }, [saveStatus, loadAvailableTimelines]);

  const handleSelectTimeline = useCallback((timelineId) => {
    if (timelineId === currentTimelineId) {
      setShowTimelineSelector(false);
      setHasUserDismissedSelector(true);
      return;
    }
    
    loadTimeline(timelineId);
    setHasUserDismissedSelector(false); // Reset dismissal flag when selecting timeline
  }, [currentTimelineId, loadTimeline]);

  const handleCloseTimelineSelector = useCallback(() => {
    setShowTimelineSelector(false);
    setHasUserDismissedSelector(true); // Mark as dismissed by user
  }, []);

  const handleDeleteTimeline = useCallback(async (timelineId) => {
    await deleteTimeline(timelineId);
    
    // Refresh timelines after deletion (but don't auto-show selector)
    await loadAvailableTimelines();
  }, [deleteTimeline, loadAvailableTimelines]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+S to save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveTimeline(false);
      }
      
      // Ctrl+N to create new timeline
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        handleCreateNewTimeline();
      }
      
      // Ctrl+O to open timeline selector
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        handleLoadTimeline();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [saveTimeline, handleCreateNewTimeline, handleLoadTimeline]);

  // Loading state
  if (!isClient) {
    return (
      <div style={{
        display: "flex",
        height: "100vh",
        background: COLORS.background,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}>
        <div style={{ color: COLORS.muted, fontSize: "1.1rem" }}>
          Loading Timeline Configuration...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: COLORS.background,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* Left Panel - Task Configuration */}
      <aside style={{
        width: CONSTANTS.PANEL_WIDTH,
        background: COLORS.card,
        borderRight: `1px solid ${COLORS.border}`,
        padding: "2rem",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        overflowY: "auto",
      }}>
        <div>
          <h2 style={{
            color: COLORS.primary,
            fontWeight: 700,
            fontSize: "1.5rem",
            marginBottom: "0.5rem",
          }}>
            Configure Timeline
          </h2>
          <p style={{
            color: COLORS.muted,
            fontSize: "0.9rem",
            marginBottom: "1rem",
          }}>
            Create and manage your project timeline from {currentYear} to {endYear}
          </p>
          
          {/* Timeline Controls */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: COLORS.background,
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
          }}>
            {/* Status Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
            }}>
              <span style={{
                color: COLORS.text,
                fontSize: '0.9rem',
                fontWeight: 500,
              }}>
                {tasks.length} tasks • {availableTimelines.length} timelines
              </span>
              <span style={{
                color: saveStatus === 'saved' ? COLORS.success : saveStatus === 'saving' ? COLORS.warning : COLORS.error,
                fontSize: '0.8rem',
                fontWeight: 500,
              }}>
                {saveStatus === 'saved' ? '✓ Auto-saved' : saveStatus === 'saving' ? '⏳ Saving' : '❌ Error'}
              </span>
            </div>
            
            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
            }}>
              <button
                onClick={handleCreateNewTimeline}
                style={{
                  background: 'none',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 6,
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.8rem',
                  color: COLORS.text,
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                ➕ New Timeline
              </button>
              <button
                onClick={handleLoadTimeline}
                style={{
                  background: 'none',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 6,
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.8rem',
                  color: COLORS.text,
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                📂 Load Timeline
              </button>
            </div>
          </div>
          
          {/* Timeline Metadata */}
          <div style={{
            ...commonStyles.card,
            marginBottom: "1.5rem",
          }}>
            <h3 style={{
              color: COLORS.text,
              fontWeight: 600,
              fontSize: "1.1rem",
              marginBottom: "1rem",
            }}>
              Timeline Details
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ position: "relative" }}>
                <InputField
                  label="Timeline Title"
                  value={timelineTitle}
                  onChange={handleTitleChange}
                  placeholder="Enter timeline title"
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: COLORS.text,
                  fontWeight: 500,
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                }}>
                  Description (Optional)
                </label>
                <textarea
                  value={timelineDescription}
                  onChange={handleDescriptionChange}
                  placeholder="Enter timeline description"
                  rows={3}
                  style={{
                    ...commonStyles.input,
                    resize: "vertical",
                    minHeight: "80px",
                  }}
                  onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                  onBlur={(e) => e.target.style.borderColor = COLORS.border}
                />
              </div>
            </div>
          </div>

          {/* Task Input Form */}
          <div style={{
            ...commonStyles.card,
            marginBottom: "1.5rem",
          }}>
            <h3 style={{
              color: COLORS.text,
              fontWeight: 600,
              fontSize: "1.1rem",
              marginBottom: "1rem",
            }}>
              Add New Task
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <InputField
                label="Task Name"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Enter task name"
              />

              <InputField
                label="Start Date"
                type="date"
                value={newTaskStart}
                onChange={(e) => setNewTaskStart(e.target.value)}
                min={`${currentYear}-01-01`}
                max={`${endYear}-12-31`}
              />

              <InputField
                label="End Date"
                type="date"
                value={newTaskEnd}
                onChange={(e) => setNewTaskEnd(e.target.value)}
                min={newTaskStart || `${currentYear}-01-01`}
                max={`${endYear}-12-31`}
              />

              <button
                onClick={addTask}
                style={{
                  ...commonStyles.button,
                  background: COLORS.primary,
                  color: "#fff",
                  padding: "0.75rem 1.5rem",
                  marginTop: "0.5rem",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = COLORS.accent;
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = COLORS.primary;
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Add Task
              </button>
            </div>
          </div>

          {/* Task List */}
          <div style={{ flex: 1 }}>
            <h3 style={{
              color: COLORS.text,
              fontWeight: 600,
              fontSize: "1.1rem",
              marginBottom: "1rem",
            }}>
              Current Tasks ({processedTasks.length})
            </h3>
            
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              maxHeight: "300px",
              overflowY: "auto",
            }}>
              {processedTasks.length === 0 ? (
                <p style={{
                  color: COLORS.muted,
                  fontSize: "0.9rem",
                  fontStyle: "italic",
                  textAlign: "center",
                  padding: "2rem",
                }}>
                  No tasks added yet. Add your first task above.
                </p>
              ) : (
                processedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onRemove={removeTask}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Right Panel - Gantt Chart */}
      <main style={{
        flex: 1,
        padding: "2rem",
        background: COLORS.background,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{
            color: COLORS.primary,
            fontWeight: 700,
            fontSize: "1.5rem",
            marginBottom: "0.5rem",
          }}>
            {timelineTitle}
          </h2>
          {timelineDescription && (
            <p style={{
              color: COLORS.muted,
              fontSize: "0.95rem",
              marginBottom: "0.5rem",
            }}>
              {timelineDescription}
            </p>
          )}
          <p style={{
            color: COLORS.muted,
            fontSize: "0.9rem",
          }}>
            Interactive Gantt chart showing your tasks timeline from {currentYear} to {endYear}
          </p>
        </div>

        <div style={{
          flex: 1,
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          overflow: "hidden",
          position: "relative",
        }}>
          {processedTasks.length === 0 ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: COLORS.muted,
              fontSize: "1.1rem",
              flexDirection: "column",
              gap: "1rem",
            }}>
              <div style={{ fontSize: "3rem", opacity: 0.3 }}>📊</div>
              <div>Add tasks to see your timeline visualization</div>
            </div>
          ) : (
            <CustomGanttChart
              tasks={processedTasks}
              startYear={startYear}
              endYear={endYear}
            />
          )}
        </div>
      </main>

      {showTimelineSelector && (
        <TimelineSelector
          isOpen={showTimelineSelector}
          onClose={handleCloseTimelineSelector}
          timelines={availableTimelines}
          currentTimelineId={currentTimelineId}
          onSelect={handleSelectTimeline}
          onDelete={handleDeleteTimeline}
          onDuplicate={duplicateTimeline}
          onCleanup={cleanupOldTimelines}
          onRename={renameLegacyTimelines}
          legacyCount={legacyCount}
          isLoading={isLoadingTimelines}
        />
      )}

      {notification && (
        <Notification notification={notification} />
      )}

      {showNewTimelineModal && (
        <NewTimelineModal
          isOpen={showNewTimelineModal}
          onClose={handleCancelNewTimeline}
          onSubmit={handleCreateNewTimelineSubmit}
          title={newTimelineTitle}
          setTitle={setNewTimelineTitle}
          description={newTimelineDescription}
          setDescription={setNewTimelineDescription}
        />
      )}
    </div>
  );
} 