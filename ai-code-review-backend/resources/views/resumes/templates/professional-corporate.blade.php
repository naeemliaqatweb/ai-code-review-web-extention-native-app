<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $rewrite->resume->user->name }} - Professional</title>
    <style>
        @page { margin: 0; }
        body {
            font-family: {{ $rewrite->style_config['fontFamily'] == 'serif' ? "'Times New Roman', serif" : ($rewrite->style_config['fontFamily'] == 'mono' ? "'Courier New', monospace" : "'Helvetica', 'Arial', sans-serif") }};
            color: #1e293b;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
        }
        .sidebar { width: 30%; position: fixed; height: 100%; background: #0f172a; color: white; padding: 40px 30px; }
        .main { margin-left: 30%; width: 70%; background: {{ $rewrite->style_config['backgroundColor'] ?? '#ffffff' }}; min-height: 1120px; padding: 60px 50px; }
        .profile-img { width: 140px; height: 140px; border-radius: 20px; object-fit: cover; margin-bottom: 30px; border: 4px solid {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }}; }
        .sidebar h2 { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }}; margin-top: 40px; margin-bottom: 15px; }
        .sidebar p { font-size: 11px; margin-bottom: 8px; color: #cbd5e1; }
        .name { font-size: 38px; font-weight: 900; color: #0f172a; margin-bottom: 5px; }
        .title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }}; margin-bottom: 40px; }
        .section-title { font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #f1f5f9; padding-bottom: 5px; margin-bottom: 20px; margin-top: 35px; }
        .summary { font-size: 14px; color: #475569; }
        .exp-item { margin-bottom: 25px; }
        .exp-header { font-weight: 800; font-size: 16px; display: block; }
        .exp-meta { font-size: 11px; color: #64748b; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; }
        .exp-ach { font-size: 13px; color: #334155; padding-left: 15px; }
    </style>
</head>
<body>
    <div class="sidebar">
        @if($rewrite->profile_image)
            <img src="{{ public_path('storage/' . $rewrite->profile_image) }}" class="profile-img">
        @endif
        <h2>Contact</h2>
        <p>{{ $rewrite->contact_details['email'] ?? $rewrite->resume->user->email }}</p>
        @if(isset($rewrite->contact_details['phone'])) <p>{{ $rewrite->contact_details['phone'] }}</p> @endif
        @if(isset($rewrite->contact_details['location'])) <p>{{ $rewrite->contact_details['location'] }}</p> @endif
        @if(isset($rewrite->contact_details['linkedin'])) <p>{{ $rewrite->contact_details['linkedin'] }}</p> @endif

        <h2>Expertise</h2>
        @foreach($rewrite->skills as $skill)
            <p>• {{ $skill }}</p>
        @endforeach
    </div>
    <div class="main">
        <h1 class="name">{{ $rewrite->resume->user->name }}</h1>
        <div class="title">Professional Resume</div>

        <div class="section-title">Summary</div>
        <div class="summary">{{ $rewrite->summary }}</div>

        <div class="section-title">Experience</div>
        @foreach($rewrite->experience as $item)
            <div class="exp-item">
                <span class="exp-header">{{ $item['role'] }}</span>
                <div class="exp-meta">{{ $item['company'] }} | {{ $item['duration'] }}</div>
                <div class="exp-ach">
                    @foreach($item['achievements'] as $ach)
                        • {{ $ach }}<br>
                    @endforeach
                </div>
            </div>
        @endforeach

        <div class="section-title">Education</div>
        @foreach($rewrite->education as $item)
            <div class="exp-item">
                <span class="exp-header">{{ $item['degree'] }}</span>
                <div class="exp-meta">{{ $item['institution'] }} | {{ $item['year'] }}</div>
            </div>
        @endforeach
    </div>
</body>
</html>
