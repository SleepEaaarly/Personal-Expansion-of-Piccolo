#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(location = 0) out highp vec4 out_color;

highp float brightness = 1.0;
highp float saturation = 10.0;
highp float contrast = 1.0;

void main() {
    highp vec4 color = subpassLoad(in_color).rgba;
    highp vec3 final_color = color.rgb * brightness;

    highp float luminance = dot(color.rgb, vec3(0.2125, 0.7154, 0.0721));
    highp vec3 luminance_color = vec3(luminance, luminance, luminance);
    final_color = mix(luminance_color, final_color, saturation);
    highp vec3 avg_color = vec3(0.5, 0.5, 0.5);
    final_color = mix(avg_color, final_color, contrast);

    out_color = vec4(final_color, color.a);
}