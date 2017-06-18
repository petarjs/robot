define("command-types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GOTO = 'goto';
    exports.LEFT = 'left';
    exports.RIGHT = 'right';
    exports.SKIP = 'skip';
    exports.LABEL = 'label';
});
define("utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getFirstWord(text) {
        return text.match(/^(\w+)/)[1];
    }
    exports.getFirstWord = getFirstWord;
    function isColiding(agent, agents) {
        return agents
            .filter(a => a !== agent && a.position === agent.position)
            .length;
    }
    exports.isColiding = isColiding;
    function getRandomColor() {
        const numOfSteps = Math.random() * 80;
        const step = Math.random() * 20;
        var r, g, b;
        var h = step / numOfSteps;
        var i = ~~(h * 6);
        var f = h * 6 - i;
        var q = 1 - f;
        switch (i % 6) {
            case 0:
                r = 1;
                g = f;
                b = 0;
                break;
            case 1:
                r = q;
                g = 1;
                b = 0;
                break;
            case 2:
                r = 0;
                g = 1;
                b = f;
                break;
            case 3:
                r = 0;
                g = q;
                b = 1;
                break;
            case 4:
                r = f;
                g = 0;
                b = 1;
                break;
            case 5:
                r = 1;
                g = 0;
                b = q;
                break;
        }
        var c = "#" + ("00" + (~~(r * 255)).toString(16)).slice(-2) + ("00" + (~~(g * 255)).toString(16)).slice(-2) + ("00" + (~~(b * 255)).toString(16)).slice(-2);
        return (c);
    }
    exports.getRandomColor = getRandomColor;
});
define("parser", ["require", "exports", "utils", "command-types"], function (require, exports, utils_1, commandTypes) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const commands = {
        l: line => ({
            type: commandTypes.LEFT,
            argument: null
        }),
        r: line => ({
            type: commandTypes.RIGHT,
            argument: null
        }),
        s: line => ({
            type: commandTypes.SKIP,
            argument: null
        }),
        g: line => ({
            type: commandTypes.GOTO,
            argument: line.match(/^[g]\s+(.+)/)[1]
        }),
        label: line => ({
            type: commandTypes.LABEL,
            argument: line,
            original: line
        })
    };
    function parseCommand(line) {
        const command = utils_1.getFirstWord(line);
        const commandTransformer = commands[command];
        if (commandTransformer) {
            return commandTransformer(line);
        }
        else {
            return commands['label'](line);
        }
    }
    function parseCode(code) {
        try {
            return code
                .split('\n')
                .map(line => line.trim())
                .filter(line => Boolean(line))
                .map(line => line.toLowerCase())
                .map(line => parseCommand(line));
        }
        catch (ex) {
            alert('Syntax Error!');
            return null;
        }
    }
    exports.parseCode = parseCode;
});
define("robot", ["require", "exports", "command-types"], function (require, exports, commandTypes) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function Robot({ name = 'Unknown', commands = [], initialPosition = 0, renderer }) {
        return {
            name,
            commands,
            renderer,
            oilMarks: [],
            position: initialPosition,
            initialPosition,
            currentCommand: commands[0],
            init() {
                this.renderer.init(this);
                this.renderer.draw();
            },
            destroy() {
                this.renderer.destroy();
            },
            setOilMarks(marks) {
                this.oilMarks = marks;
            },
            executeNextCommand() {
                this.executeCommand(this.currentCommand);
                this.currentCommand = this.getNextCommand();
            },
            getNextCommand() {
                if (!this.currentCommand) {
                    return null;
                }
                if (this.currentCommand.type === commandTypes.GOTO) {
                    return this.commands
                        .find(c => c.type === 'label' && c.argument === this.currentCommand.argument);
                }
                const currentCommandIndex = this.commands.indexOf(this.currentCommand);
                const nextCommand = this.commands[currentCommandIndex + 1];
                if (!nextCommand) {
                    return null;
                }
                return nextCommand;
            },
            getNextCommandSkip() {
                if (!this.currentCommand) {
                    return null;
                }
                const currentCommandIndex = this.commands.indexOf(this.currentCommand);
                const nextCommand = this.commands[currentCommandIndex + 2];
                if (!nextCommand) {
                    return null;
                }
                return nextCommand;
            },
            executeCommand(command) {
                if (command) {
                    this[command.type](command.argument);
                    this.logCommand(command);
                    this.renderer.draw();
                }
            },
            logCommand(command) {
                console.log(`${name} - ${command.type} - ${command.argument}`);
            },
            [commandTypes.GOTO](arg) { },
            [commandTypes.LEFT](arg) {
                this.position--;
            },
            [commandTypes.RIGHT](arg) {
                this.position++;
            },
            [commandTypes.SKIP](arg) {
                if (this.oilMarks.indexOf(this.position) !== -1) {
                    console.log('Oil mark! Skipping next command');
                    this.currentCommand = this.getNextCommandSkip();
                }
            },
            [commandTypes.LABEL](arg) { }
        };
    }
    exports.default = Robot;
});
define("interpreter", ["require", "exports", "utils"], function (require, exports, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const COMMAND_EXECUTION_TIME = 300;
    function execute(agents) {
        const oilMarks = agents.map(agent => agent.initialPosition);
        agents.forEach(agent => agent.setOilMarks(oilMarks));
        const interval = setInterval(function () {
            agents.forEach(agent => agent.executeNextCommand());
            const someAgentsHaveCommandsLeft = agents
                .reduce((acc, agent) => acc || agent.currentCommand, false);
            const areAgentsColiding = agents
                .reduce((acc, agent) => acc || utils_2.isColiding(agent, agents), false);
            if (!someAgentsHaveCommandsLeft) {
                console.log('No more commands to execute for one or more agents. Stopping.');
                clearInterval(interval);
            }
            if (areAgentsColiding) {
                console.log('Agents are colliding! Success!');
                clearInterval(interval);
            }
        }, COMMAND_EXECUTION_TIME);
    }
    exports.execute = execute;
});
define("renderer", ["require", "exports", "utils"], function (require, exports, utils_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function RobotRenderer() {
        return {
            init(ctx) {
                this.ctx = ctx;
                this.el = document.createElement('div');
                this.el.classList.add('robot');
                this.el.style.background = utils_3.getRandomColor();
                document.querySelector('.container').appendChild(this.el);
                this.oil = document.createElement('div');
                this.oil.classList.add('oil');
                document.querySelector('.container').appendChild(this.oil);
                this.oil.style.transform = 'translateX(' + this.ctx.position * 50 + 'px)';
            },
            destroy() {
                this.el.remove();
                this.oil.remove();
            },
            draw() {
                this.el.style.transform = 'translateX(' + this.ctx.position * 50 + 'px)';
            }
        };
    }
    exports.default = RobotRenderer;
});
define("index", ["require", "exports", "parser", "robot", "interpreter", "renderer"], function (require, exports, parser_1, robot_1, interpreter_1, renderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const code = `

loop
l
s
g loop

loop2
l
g loop2


`;
    const codeExample = `

loop
l
l
s
r
r
s
g loop

`;
    let robots = [];
    document.querySelector('.js-code').value = codeExample;
    document.querySelector('.js-stop').addEventListener('click', function () {
        if (robots.length) {
            robots.forEach(robot => robot.destroy());
        }
    });
    document.querySelector('.js-execute').addEventListener('click', function () {
        const code = document.querySelector('.js-code').value;
        const commands = parser_1.parseCode(code);
        if (!commands) {
            return;
        }
        if (robots.length) {
            robots.forEach(robot => robot.destroy());
        }
        robots = [
            robot_1.default({
                name: 'Robot 1',
                commands: commands,
                initialPosition: -2,
                renderer: renderer_1.default()
            }),
            robot_1.default({
                name: 'Robot 2',
                commands,
                initialPosition: 1,
                renderer: renderer_1.default()
            })
        ];
        robots.forEach(robot => robot.init());
        interpreter_1.execute(robots);
    });
});
