import React, { useEffect, useRef, useState } from 'react';
import Matter, { Engine, Render, World, Bodies, Mouse, MouseConstraint, Body, Vector } from 'matter-js';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const PhysicsSocialButtons = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Engine.create());
  const [rendererCreated, setRendererCreated] = useState(false);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Create engine and world
    const engine = engineRef.current;
    const world = engine.world;

    // Calculate container dimensions
    const containerWidth = sceneRef.current.clientWidth;
    const containerHeight = 300;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: containerWidth,
        height: containerHeight,
        wireframes: false,
        background: 'transparent',
      }
    });

    setRendererCreated(true);

    // Create bodies for social media buttons
    const buttons = [
      {
        name: 'Facebook',
        color: '#1877F2',
        icon: Facebook,
        link: 'https://facebook.com'
      },
      {
        name: 'Twitter',
        color: '#1DA1F2',
        icon: Twitter,
        link: 'https://twitter.com'
      },
      {
        name: 'Instagram',
        color: '#E4405F',
        icon: Instagram,
        link: 'https://instagram.com'
      }
    ];

    // Calculate starting positions to spread buttons horizontally
    const buttonWidth = 150;
    const buttonHeight = 50;
    const startingPositions = buttons.map((_, index) => {
      return {
        x: containerWidth / 4 + (index * containerWidth / 3),
        y: -50 - (index * 50) // Start above the canvas
      };
    });

    // Create button bodies with more size to accommodate text
    const buttonBodies = buttons.map((button, index) => {
      return Bodies.rectangle(
        startingPositions[index].x,
        startingPositions[index].y,
        buttonWidth,
        buttonHeight,
        {
          render: {
            fillStyle: button.color,
            strokeStyle: '#FFFFFF',
            lineWidth: 2
          },
          label: button.name,
          restitution: 0.8,
          friction: 0.005,
          density: 0.001, // Make buttons lighter
        }
      );
    });

    // Add all bodies to the world
    World.add(world, [
      // Walls - we only add ground, left and right walls to keep buttons within view
      Bodies.rectangle(containerWidth / 2, containerHeight + 30, containerWidth, 60, { isStatic: true }), // Ground
      Bodies.rectangle(-30, containerHeight / 2, 60, containerHeight, { isStatic: true }), // Left wall
      Bodies.rectangle(containerWidth + 30, containerHeight / 2, 60, containerHeight, { isStatic: true }), // Right wall
      ...buttonBodies
    ]);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    World.add(world, mouseConstraint);
    render.mouse = mouse;

    // Run the engine and renderer
    Matter.Runner.run(engine);
    Render.run(render);

    // Create an overlay of the actual buttons for easier interaction
    // We'll render these buttons in the React component, positioned where the physics bodies are

    // Handle clicks on bodies
    Matter.Events.on(mouseConstraint, 'mouseup', (event) => {
      const body = mouseConstraint.body;
      if (body) {
        const button = buttons.find(b => b.name === body.label);
        if (button) {
          window.open(button.link, '_blank');
        }
      }
    });

    // Apply small random forces to keep buttons moving slightly
    const applyRandomForces = () => {
      buttonBodies.forEach(body => {
        if (Math.random() > 0.7) {
          const forceMagnitude = 0.0005;
          Body.applyForce(
            body,
            { x: body.position.x, y: body.position.y },
            Vector.create(
              (Math.random() - 0.5) * forceMagnitude,
              (Math.random() - 0.5) * forceMagnitude
            )
          );
        }
      });
    };

    const forceInterval = setInterval(applyRandomForces, 2000);

    // Handle window resize
    const handleResize = () => {
      if (!sceneRef.current) return;
      render.canvas.width = sceneRef.current.clientWidth;
      render.bounds.max.x = render.canvas.width;
      render.options.width = render.canvas.width;
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearInterval(forceInterval);
      Render.stop(render);
      World.clear(world, false);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
      render.textures = {};
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-display font-light text-center mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
        Follow us on <span className="relative inline-block">
          social media
          <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
        </span>
      </h2>
      <div 
        className="w-full rounded-xl bg-secondary/30 backdrop-blur-sm p-4 overflow-hidden"
        style={{ height: '320px' }} // Fixed height container with padding
      >
        <div 
          ref={sceneRef} 
          className="w-full h-full rounded-lg relative"
        >
          {rendererCreated && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="text-sm text-center text-muted-foreground">
                Drag and play with the buttons!
              </div>
            </div>
          )}
          
          {/* We overlay the buttons with actual texts here */}
          <canvas className="w-full h-full rounded-lg"></canvas>
        </div>
      </div>
    </div>
  );
};

export default PhysicsSocialButtons;
