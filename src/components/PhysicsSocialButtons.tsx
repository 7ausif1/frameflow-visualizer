import React, { useEffect, useRef, useState } from 'react';
import Matter, { Engine, Render, World, Bodies, Mouse, MouseConstraint, Body, Vector } from 'matter-js';
import { Facebook, Twitter, Instagram, Github, Youtube, Linkedin, Mail, Globe, type LucideIcon } from 'lucide-react';

export type SocialButtonProps = {
  name: string;
  color: string;
  icon: LucideIcon;
  link: string;
  text?: string;
};

type PhysicsSocialButtonsProps = {
  title?: string;
  subtitle?: string;
  buttons?: SocialButtonProps[];
  containerHeight?: number;
  buttonWidth?: number;
  buttonHeight?: number;
  backgroundColor?: string;
};

const defaultButtons: SocialButtonProps[] = [
  {
    name: 'Facebook',
    color: '#1877F2',
    icon: Facebook,
    link: 'https://facebook.com',
    text: 'Facebook'
  },
  {
    name: 'Twitter',
    color: '#1DA1F2',
    icon: Twitter,
    link: 'https://twitter.com',
    text: 'Twitter'
  },
  {
    name: 'Instagram',
    color: '#E4405F',
    icon: Instagram,
    link: 'https://instagram.com',
    text: 'Instagram'
  }
];

const PhysicsSocialButtons: React.FC<PhysicsSocialButtonsProps> = ({
  title = "Follow us on social media",
  subtitle = "Drag and play with the buttons!",
  buttons = defaultButtons,
  containerHeight = 320,
  buttonWidth = 150,
  buttonHeight = 50,
  backgroundColor = 'bg-secondary/30'
}) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Engine.create());
  const [rendererCreated, setRendererCreated] = useState(false);
  const [buttonPositions, setButtonPositions] = useState<{[key: string]: {x: number, y: number, angle: number}}>({});

  const updateButtonPositions = () => {
    const newPositions: {[key: string]: {x: number, y: number, angle: number}} = {};
    
    rendererRef.current?.allBodies.forEach(body => {
      if (buttons.some(btn => btn.name === body.label)) {
        newPositions[body.label] = {
          x: body.position.x,
          y: body.position.y,
          angle: body.angle
        };
      }
    });
    
    setButtonPositions(newPositions);
  };

  const rendererRef = useRef<Matter.Render>();
  const buttonBodiesRef = useRef<Matter.Body[]>([]);

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = engineRef.current;
    const world = engine.world;

    const containerWidth = sceneRef.current.clientWidth;
    const visibleHeight = containerHeight - 40;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: containerWidth,
        height: visibleHeight,
        wireframes: false,
        background: 'transparent',
      }
    });

    rendererRef.current = render;
    setRendererCreated(true);

    const startingPositions = buttons.map((_, index) => {
      return {
        x: containerWidth / 4 + (index * containerWidth / 3),
        y: -50 - (index * 50)
      };
    });

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
          density: 0.001
        }
      );
    });

    buttonBodiesRef.current = buttonBodies;

    World.add(world, [
      Bodies.rectangle(containerWidth / 2, visibleHeight + 30, containerWidth * 2, 60, { isStatic: true }),
      Bodies.rectangle(-30, visibleHeight / 2, 60, visibleHeight * 2, { isStatic: true }),
      Bodies.rectangle(containerWidth + 30, visibleHeight / 2, 60, visibleHeight * 2, { isStatic: true }),
      ...buttonBodies
    ]);

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

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Render.run(render);

    Matter.Events.on(mouseConstraint, 'mouseup', (event) => {
      const body = mouseConstraint.body;
      if (body) {
        const button = buttons.find(b => b.name === body.label);
        if (button) {
          window.open(button.link, '_blank');
        }
      }
    });

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

    const updatePositionsInterval = setInterval(updateButtonPositions, 1000 / 60);

    const handleResize = () => {
      if (!sceneRef.current) return;
      render.canvas.width = sceneRef.current.clientWidth;
      render.bounds.max.x = render.canvas.width;
      render.options.width = render.canvas.width;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(forceInterval);
      clearInterval(updatePositionsInterval);
      Matter.Runner.stop(runner);
      Render.stop(render);
      World.clear(world, false);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
      render.textures = {};
      window.removeEventListener('resize', handleResize);
    };
  }, [buttons, buttonHeight, buttonWidth, containerHeight]);

  const getIconComponent = (button: SocialButtonProps) => {
    const Icon = button.icon;
    return <Icon size={18} />;
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-display font-light text-center mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
        {title} <span className="relative inline-block">
          <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
        </span>
      </h2>
      <div 
        className={`w-full rounded-xl ${backgroundColor} backdrop-blur-sm p-4 overflow-hidden`}
        style={{ height: `${containerHeight}px` }}
      >
        <div 
          ref={sceneRef} 
          className="w-full h-full rounded-lg relative"
        >
          {rendererCreated && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="text-sm text-center text-muted-foreground">
                {subtitle}
              </div>
            </div>
          )}
          
          {Object.entries(buttonPositions).map(([name, position]) => {
            const button = buttons.find(b => b.name === name);
            if (!button) return null;
            
            return (
              <div 
                key={name}
                className="absolute pointer-events-none flex items-center justify-center gap-2 text-sm font-medium text-white transition-opacity"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  width: `${buttonWidth}px`,
                  height: `${buttonHeight}px`,
                  transform: `translate(-50%, -50%) rotate(${position.angle}rad)`,
                }}
              >
                {getIconComponent(button)}
                {button.text && <span>{button.text}</span>}
              </div>
            );
          })}
          
          <canvas className="w-full h-full rounded-lg"></canvas>
        </div>
      </div>
    </div>
  );
};

export default PhysicsSocialButtons;
