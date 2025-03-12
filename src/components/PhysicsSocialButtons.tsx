
import React, { useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Mouse, MouseConstraint } from 'matter-js';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const PhysicsSocialButtons = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Engine.create());

  useEffect(() => {
    if (!sceneRef.current) return;

    // Create engine and world
    const engine = engineRef.current;
    const world = engine.world;

    // Create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: 300,
        wireframes: false,
        background: 'transparent',
      }
    });

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

    const buttonBodies = buttons.map((button, index) => {
      return Bodies.rectangle(
        100 + (index * 150),
        -50 - (index * 50), // Start above the canvas
        120,
        40,
        {
          render: {
            fillStyle: button.color,
          },
          label: button.name,
          restitution: 0.8,
          friction: 0.005,
        }
      );
    });

    // Add all bodies to the world
    World.add(world, [
      // Walls
      Bodies.rectangle(render.canvas.width / 2, render.canvas.height + 30, render.canvas.width, 60, { isStatic: true }), // Ground
      Bodies.rectangle(-30, render.canvas.height / 2, 60, render.canvas.height, { isStatic: true }), // Left wall
      Bodies.rectangle(render.canvas.width + 30, render.canvas.height / 2, 60, render.canvas.height, { isStatic: true }), // Right wall
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
      Render.stop(render);
      World.clear(world, false);
      Engine.clear(engine);
      render.canvas.remove();
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
        ref={sceneRef} 
        className="w-full bg-secondary/30 rounded-xl backdrop-blur-sm"
      />
    </div>
  );
};

export default PhysicsSocialButtons;
