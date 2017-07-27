'use strict';

function speechToText($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, log) {
            scope.final_transcript = "";
            scope.interim_transcript = "";
            var recognition = new webkitSpeechRecognition();
            var isListening = false;
            recognition.lang = "pt-BR";
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onresult = function (event) {
                var interim_transcript = '';
                var final_transcript = '';

                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }
                final_transcript = capitalize(final_transcript);
                final_transcript = punctuation(final_transcript);
                scope.final_transcript = linebreak(final_transcript);

                scope.interim_transcript = punctuation(linebreak(interim_transcript));
                scope.$apply();
            }

            var span = "<div class=\"stt-container\"><span>{{interim_transcript}}</span><span>{{final_transcript}}</span></div><div><button id=\"stt\">Start</button></div>";
            var comp_span = $compile(span)(scope);

            element.append(comp_span);

            function punctuation(s) {
                return s.replace(/ v\u00edrgula/g, ',')
                    .replace(/ novo parágrafo/g, '.<br>')
                    .replace(/ ponto/g, '.');
            }

            var two_line = /\n\n/g;
            var one_line = /\n/g;

            function linebreak(s) {
                return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
            }
            
            var first_char = /\S/;
            var first_char_sent = /\. \S/;

            function capitalize(s) {

                s = s.replace(first_char_sent, function (m) {
                    return m.toUpperCase();
                });

                return s.replace(first_char, function (m) {
                    return m.toUpperCase();
                });
            }


            var btn = element.find('button');
            btn.on('click', function () {
                if (isListening) {
                    recognition.stop();
                    isListening = false;
                } else {
                    recognition.start();
                    isListening = true;
                }
            });
        }
    };
}