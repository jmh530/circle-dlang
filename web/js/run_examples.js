/**
 * Run all unittest examples
 *
 * Copyright 2016 by D Language Foundation
 *
 * License: http://boost.org/LICENSE_1_0.txt, Boost License 1.0
 */

// wraps a unittest into a runnable script
function wrapIntoMain(code) {
    var currentPackage = $('body')[0].id;
    // BUMP package image here: https://github.com/dlang-tour/core-exec/blob/master/Dockerfile
    // run.dlang.io frontend: https://github.com/dlang-tour/core/blob/master/public/static/js/tour-controller.js
    var codeOut = '/+dub.sdl:\ndependency "'+currentLibrary+'" version="~>'+currentVersion+'"\n+/\n';

    // dynamically wrap into main if needed
    if (code.indexOf("void main") >= 0) {
        codeOut += "import " + currentPackage + "; ";
        codeOut += code;
    }
    else {
        codeOut += "void main()\n{\n";
        codeOut += "    import " + currentPackage + ";\n";
        // writing to the stdout is probably often used
        codeOut += "    import std.stdio: write, writeln, writef, writefln;\n    ";
        codeOut += code.split("\n").join("\n    ");
        codeOut += "\n}";
    }
    return codeOut;
}

$(document).ready(function()
{
    if ($('body')[0].id == "Home")
        return;

    // only for std at the moment
    if (!$('body').hasClass("std"))
        return;

    // first selector is for ddoc - second for ddox
    var codeBlocks = $('pre[class~=d_code]').add('pre[class~=code]');
    codeBlocks.each(function(index)
    {
        var currentExample = $(this);
        var orig = currentExample.html();

        // check whether it is from a ddoced unittest
        // 1) check is for ddoc, 2) for ddox
        // manual created tests most likely can't be run without modifications
        if (!($(this).parent().parent().prev().hasClass("dlang_runnable") ||
              $(this).prev().children(":last").hasClass("dlang_runnable")))
            return;

        currentExample.replaceWith(
                '<div class="unittest_examples">'
                    + '<div class="d_code">'
                        + '<pre class="d_code">'+orig+'</pre>'
                    + '</div>'
                    + '<div class="d_run_code" style="display: block">'
                        + '<textarea class="d_code" style="display: none;"></textarea>'
                    + '</div>'
                    + '<div class="d_example_buttons">'
          + '<div class="editButton"><i class="fa fa-edit" aria-hidden="true"></i> Edit</div>'
          + '<div class="runButton"><i class="fa fa-play" aria-hidden="true"></i> Run</div>'
          + '<div class="resetButton" style="display:none"><i class="fa fa-undo " aria-hidden="true"></i> Reset</div>'
          + '<div class="openInEditorButton" title="Open in an external editor"><i class="fa fa-external-link" aria-hidden="true"></i></div>'
                    + '</div>'
                    + '<div class="d_code_output"><span class="d_code_title">Application output</span><br><pre class="d_code_output" readonly>Running...</pre>'
                + '</div>'
        );
    });

    $('textarea[class=d_code]').each(function(index) {
        var parent = $(this).parent();
        var btnParent = parent.parent().children(".d_example_buttons");
        var outputDiv = parent.parent().children(".d_code_output");
        var editor = setupTextarea(this,  {
          parent: btnParent,
          outputDiv: outputDiv,
          stdin: false,
          args: false,
          transformOutput: wrapIntoMain,
          defaultOutput: "All tests passed",
          keepCode: true,
          outputHeight: "auto",
          backend: "tour"
        });
    });
});
